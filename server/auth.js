const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mysql = require("mysql2");
const { sendOtpEmail, isSmtpConfigured } = require("./email");

const router = express.Router();

// Local database connection pool with Promise support
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
}).promise();

// In-memory rate limiting map for failed login attempts by IP
const loginRateLimit = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_LOGINS = 10;

// Periodic cleanup of stale rate-limit records
setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of loginRateLimit.entries()) {
        if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
            loginRateLimit.delete(ip);
        }
    }
}, 5 * 60 * 1000).unref();

function checkLoginRateLimit(ip) {
    const now = Date.now();
    const entry = loginRateLimit.get(ip);
    if (!entry) return true;
    if (now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
        loginRateLimit.delete(ip);
        return true;
    }
    return entry.count < MAX_FAILED_LOGINS;
}

function recordFailedLogin(ip) {
    const now = Date.now();
    const entry = loginRateLimit.get(ip);
    if (!entry || now - entry.firstAttempt > RATE_LIMIT_WINDOW_MS) {
        loginRateLimit.set(ip, { count: 1, firstAttempt: now });
    } else {
        entry.count += 1;
    }
}

function resetFailedLogin(ip) {
    loginRateLimit.delete(ip);
}

function maskEmail(email) {
    if (typeof email !== "string" || !email.includes("@")) {
        return "a***@***";
    }
    const [user, domain] = email.split("@");
    const maskedUser = user.length <= 2 
        ? user[0] + "***" 
        : user[0] + "***" + user[user.length - 1];
    return `${maskedUser}@${domain}`;
}

// ==============================================================================
// A. POST /api/auth/login
// Primary authentication: verifies password and initiates email OTP challenge.
// NEVER issues a JWT token.
// ==============================================================================
router.post("/login", async (req, res) => {
    const clientIp = req.ip || req.connection.remoteAddress || "unknown";

    if (!checkLoginRateLimit(clientIp)) {
        return res.status(429).json({
            message: "Too many failed login attempts. Please try again after 15 minutes."
        });
    }

    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string" ||
        !email.trim() ||
        !password
    ) {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
        // Query administrator by normalized email
        const [users] = await pool.query(
            `SELECT id, name, email, password FROM admin_users WHERE email = ? LIMIT 1`,
            [normalizedEmail]
        );

        if (users.length === 0) {
            recordFailedLogin(clientIp);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        const admin = users[0];
        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            recordFailedLogin(clientIp);
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Password verified: reset failed login count for this IP
        resetFailedLogin(clientIp);

        // Verify OTP_SECRET and JWT_SECRET configuration
        if (!process.env.OTP_SECRET) {
            console.error("Configuration error: OTP_SECRET is missing.");
            return res.status(500).json({ message: "Server configuration error." });
        }
        if (!process.env.JWT_SECRET) {
            console.error("Configuration error: JWT_SECRET is missing.");
            return res.status(500).json({ message: "Server configuration error." });
        }

        // Verify SMTP configuration before initiating challenge
        if (!isSmtpConfigured()) {
            console.error("Configuration notice: SMTP server is not configured in server/.env");
            return res.status(500).json({
                message: "Email verification service is temporarily unavailable. Please verify SMTP settings."
            });
        }

        // --------------------------------------------------------------------------
        // Phase 1: Preparation Transaction (Sub-millisecond lock, committed before SMTP)
        // --------------------------------------------------------------------------
        let challengeId = null;
        let otp = null;

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            // Coordinate admin-level actions
            await conn.query(
                `SELECT id FROM admin_users WHERE id = ? FOR UPDATE`,
                [admin.id]
            );

            // Check cooldown & in-flight dispatch
            const [latestRows] = await conn.query(
                `SELECT id, created_at, delivery_status, used,
                        TIMESTAMPDIFF(SECOND, created_at, NOW()) AS elapsed_seconds
                 FROM admin_otp_challenges
                 WHERE admin_id = ?
                 ORDER BY id DESC
                 LIMIT 1
                 FOR UPDATE`,
                [admin.id]
            );

            if (latestRows.length > 0) {
                const latest = latestRows[0];
                if (latest.delivery_status === "pending" && latest.used === 0 && latest.elapsed_seconds < 60) {
                    await conn.rollback();
                    return res.status(429).json({
                        message: "A verification code dispatch is already in progress. Please wait."
                    });
                }

                if (latest.elapsed_seconds < 60) {
                    await conn.rollback();
                    const remainingCooldown = 60 - latest.elapsed_seconds;
                    return res.status(429).json({
                        message: `Please wait ${remainingCooldown} second(s) before requesting a new verification code.`
                    });
                }
            }

            // Invalidate all prior active challenges for this administrator
            await conn.query(
                `UPDATE admin_otp_challenges SET used = 1 WHERE admin_id = ? AND used = 0`,
                [admin.id]
            );

            // Generate cryptographically secure OTP and challenge ID
            otp = crypto.randomInt(100000, 1000000).toString();
            challengeId = crypto.randomBytes(32).toString("hex");

            // Keyed HMAC-SHA-256 hash using OTP_SECRET
            const otpHash = crypto.createHmac("sha256", process.env.OTP_SECRET)
                                  .update(otp)
                                  .digest("hex");

            // Insert new challenge with delivery_status = 'pending'
            await conn.query(
                `INSERT INTO admin_otp_challenges
                 (admin_id, challenge_id, otp_hash, attempts, max_attempts, used, delivery_status, expires_at)
                 VALUES (?, ?, ?, 0, 3, 0, 'pending', NOW() + INTERVAL 5 MINUTE)`,
                [admin.id, challengeId, otpHash]
            );

            await conn.commit();
        } catch (txErr) {
            await conn.rollback();
            throw txErr;
        } finally {
            conn.release();
        }

        // --------------------------------------------------------------------------
        // Phase 2: Asynchronous SMTP Transmission (Zero DB locks held)
        // --------------------------------------------------------------------------
        try {
            await sendOtpEmail(admin.email, otp);
        } catch (mailErr) {
            // Fail-closed on SMTP failure/timeout: permanently invalidate challenge
            await pool.query(
                `UPDATE admin_otp_challenges
                 SET delivery_status = 'failed', used = 1
                 WHERE challenge_id = ?`,
                [challengeId]
            );
            return res.status(500).json({
                message: "Unable to deliver verification email. Please try again."
            });
        }

        // --------------------------------------------------------------------------
        // Phase 3: Activation Transaction
        // --------------------------------------------------------------------------
        const [actResult] = await pool.query(
            `UPDATE admin_otp_challenges
             SET delivery_status = 'sent'
             WHERE challenge_id = ? AND used = 0 AND delivery_status = 'pending'`,
            [challengeId]
        );

        if (actResult.affectedRows === 0) {
            return res.status(500).json({
                message: "Verification challenge was superseded or expired during dispatch. Please try again."
            });
        }

        return res.json({
            status: "OTP_REQUIRED",
            challengeId,
            emailMasked: maskEmail(admin.email),
            expiresInSeconds: 300
        });

    } catch (error) {
        console.error("Login processing error:", error.code || error.name || "AUTH_ERROR");
        return res.status(500).json({
            message: "Something went wrong. Please try again."
        });
    }
});

// ==============================================================================
// B. POST /api/auth/verify-otp
// Verifies challenge state, expiry, attempts, and HMAC-SHA-256 OTP.
// Issues the final 1-hour JWT token ONLY upon successful verification.
// ==============================================================================
router.post("/verify-otp", async (req, res) => {
    const { challengeId, otp } = req.body;

    if (
        typeof challengeId !== "string" ||
        !/^[a-f0-9]{64}$/.test(challengeId.trim()) ||
        typeof otp !== "string" ||
        !/^\d{6}$/.test(otp.trim())
    ) {
        return res.status(400).json({
            message: "Valid challenge ID and 6-digit verification code are required."
        });
    }

    const cleanChallengeId = challengeId.trim();
    const cleanOtp = otp.trim();

    if (!process.env.OTP_SECRET || !process.env.JWT_SECRET) {
        console.error("Configuration error: OTP_SECRET or JWT_SECRET is missing.");
        return res.status(500).json({ message: "Server configuration error." });
    }

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Lock challenge row exclusively
        const [rows] = await conn.query(
            `SELECT id, admin_id, otp_hash, attempts, max_attempts, used, delivery_status, expires_at
             FROM admin_otp_challenges
             WHERE challenge_id = ?
             FOR UPDATE`,
            [cleanChallengeId]
        );

        if (rows.length === 0) {
            await conn.rollback();
            return res.status(401).json({ message: "Invalid verification challenge." });
        }

        const challenge = rows[0];

        // 2. Validate delivery and unconsumed status
        if (challenge.delivery_status !== "sent" || challenge.used !== 0) {
            await conn.rollback();
            return res.status(401).json({
                message: challenge.delivery_status === "pending"
                    ? "Verification challenge is still pending delivery confirmation."
                    : "This code is no longer valid or has already been used. Please log in again."
            });
        }

        // 3. Expiration check
        if (new Date(challenge.expires_at) <= new Date()) {
            await conn.query(
                `UPDATE admin_otp_challenges SET used = 1 WHERE id = ?`,
                [challenge.id]
            );
            await conn.commit();
            return res.status(401).json({ message: "Verification code has expired. Please request a new code." });
        }

        // 4. Attempt limits check
        if (challenge.attempts >= challenge.max_attempts) {
            await conn.query(
                `UPDATE admin_otp_challenges SET used = 1 WHERE id = ?`,
                [challenge.id]
            );
            await conn.commit();
            return res.status(401).json({ message: "Maximum verification attempts exceeded. Please log in again." });
        }

        // 5. Timing-safe HMAC-SHA-256 verification
        const computedHash = crypto.createHmac("sha256", process.env.OTP_SECRET)
                                   .update(cleanOtp)
                                   .digest("hex");

        const isMatch = crypto.timingSafeEqual(
            Buffer.from(computedHash, "hex"),
            Buffer.from(challenge.otp_hash, "hex")
        );

        if (!isMatch) {
            const nextAttempts = challenge.attempts + 1;
            const isLocked = nextAttempts >= challenge.max_attempts;

            await conn.query(
                `UPDATE admin_otp_challenges
                 SET attempts = ?, used = IF(? = 1, 1, used)
                 WHERE id = ?`,
                [nextAttempts, isLocked ? 1 : 0, challenge.id]
            );
            await conn.commit();

            const remaining = challenge.max_attempts - nextAttempts;
            return res.status(401).json({
                message: remaining > 0
                    ? `Invalid verification code. You have ${remaining} attempt(s) remaining.`
                    : "Maximum verification attempts exceeded. Please log in again."
            });
        }

        // 6. SUCCESS: Atomically mark used = 1
        await conn.query(
            `UPDATE admin_otp_challenges SET used = 1 WHERE id = ?`,
            [challenge.id]
        );

        // Fetch administrator profile for JWT payload
        const [adminRows] = await conn.query(
            `SELECT id, name, email FROM admin_users WHERE id = ? LIMIT 1`,
            [challenge.admin_id]
        );
        await conn.commit();

        const admin = adminRows[0];

        // 7. Issue the 1-hour JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.json({
            message: "Login successful.",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });

    } catch (err) {
        await conn.rollback();
        console.error("OTP verification error:", err.code || err.name || "VERIFY_ERROR");
        return res.status(500).json({
            message: "Something went wrong during verification. Please try again."
        });
    } finally {
        conn.release();
    }
});

// ==============================================================================
// C. POST /api/auth/resend-otp
// Resends a new OTP for the administrator associated with the challenge.
// Enforces 60-second cooldown and admin-level locking.
// ==============================================================================
router.post("/resend-otp", async (req, res) => {
    const { challengeId } = req.body;

    if (
        typeof challengeId !== "string" ||
        !/^[a-f0-9]{64}$/.test(challengeId.trim())
    ) {
        return res.status(400).json({
            message: "Valid challenge ID is required."
        });
    }

    const cleanChallengeId = challengeId.trim();

    if (!process.env.OTP_SECRET) {
        console.error("Configuration error: OTP_SECRET is missing.");
        return res.status(500).json({ message: "Server configuration error." });
    }

    let newChallengeId = null;
    let newOtp = null;
    let adminEmail = null;

    // Resolve administrator ID using an un-locked index read before transaction
    const [lookupRows] = await pool.query(
        `SELECT admin_id FROM admin_otp_challenges WHERE challenge_id = ? LIMIT 1`,
        [cleanChallengeId]
    );

    if (lookupRows.length === 0) {
        return res.status(401).json({ message: "Invalid verification challenge." });
    }

    const adminId = lookupRows[0].admin_id;

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // 1. Lock administrator row FIRST
        // Guarantees uniform lock hierarchy across all endpoints: admin_users -> admin_otp_challenges
        const [adminRows] = await conn.query(
            `SELECT id, email FROM admin_users WHERE id = ? FOR UPDATE`,
            [adminId]
        );

        if (adminRows.length === 0) {
            await conn.rollback();
            return res.status(401).json({ message: "Administrator account not found." });
        }

        adminEmail = adminRows[0].email;

        // 2. Lock and re-validate requested challenge row under the admin lock
        const [challengeRows] = await conn.query(
            `SELECT id, admin_id, used, delivery_status, attempts, max_attempts, expires_at,
                    TIMESTAMPDIFF(SECOND, created_at, NOW()) AS elapsed_seconds
             FROM admin_otp_challenges
             WHERE challenge_id = ? AND admin_id = ?
             LIMIT 1
             FOR UPDATE`,
            [cleanChallengeId, adminId]
        );

        if (challengeRows.length === 0) {
            await conn.rollback();
            return res.status(401).json({ message: "Invalid verification challenge." });
        }

        const challenge = challengeRows[0];

        // 3. Lock and retrieve the latest challenge for this administrator
        const [latestRows] = await conn.query(
            `SELECT id, created_at, delivery_status, used,
                    TIMESTAMPDIFF(SECOND, created_at, NOW()) AS elapsed_seconds
             FROM admin_otp_challenges
             WHERE admin_id = ?
             ORDER BY id DESC
             LIMIT 1
             FOR UPDATE`,
            [adminId]
        );

        const latest = latestRows[0];

        // 4. Challenge Lifecycle State Validations (Inside Transaction & Under Locks)
        // A. Superseded: Cannot resend if a newer challenge was already issued
        if (challenge.id !== latest.id) {
            await conn.rollback();
            return res.status(401).json({
                message: "This verification challenge has been superseded. Please log in again."
            });
        }

        // B. Consumed / Inactive: Cannot resend if already used (e.g. verified or invalidated)
        if (challenge.used !== 0) {
            await conn.rollback();
            return res.status(401).json({
                message: "This verification challenge is no longer active. Please log in again."
            });
        }

        // C. Delivery status: Must be successfully delivered ('sent')
        if (challenge.delivery_status !== "sent") {
            await conn.rollback();
            if (challenge.delivery_status === "pending" && challenge.elapsed_seconds < 60) {
                return res.status(429).json({
                    message: "A verification code dispatch is already in progress. Please wait."
                });
            }
            return res.status(401).json({
                message: "This verification challenge is not eligible for resend. Please log in again."
            });
        }

        // D. Exhausted: Cannot resend if maximum verification attempts were reached
        if (challenge.attempts >= challenge.max_attempts) {
            await conn.rollback();
            return res.status(401).json({
                message: "Maximum verification attempts exceeded. Please log in again."
            });
        }

        // 5. Cooldown Enforcement: 60-second cooldown from most recent dispatch
        if (latest.elapsed_seconds < 60) {
            await conn.rollback();
            const remainingCooldown = 60 - latest.elapsed_seconds;
            return res.status(429).json({
                message: `Please wait ${remainingCooldown} second(s) before requesting a new verification code.`
            });
        }

        // 6. Verify SMTP configuration before invalidating existing challenge and dispatching
        if (!isSmtpConfigured()) {
            await conn.rollback();
            console.error("Configuration notice: SMTP server is not configured in server/.env");
            return res.status(500).json({
                message: "Email verification service is temporarily unavailable. Please verify SMTP settings."
            });
        }

        // 7. Invalidate all prior active challenges for this administrator
        await conn.query(
            `UPDATE admin_otp_challenges SET used = 1 WHERE admin_id = ? AND used = 0`,
            [adminId]
        );

        // 7. Generate new OTP and challenge ID
        newOtp = crypto.randomInt(100000, 1000000).toString();
        newChallengeId = crypto.randomBytes(32).toString("hex");

        const newOtpHash = crypto.createHmac("sha256", process.env.OTP_SECRET)
                                 .update(newOtp)
                                 .digest("hex");

        // 8. Insert new challenge with delivery_status = 'pending'
        await conn.query(
            `INSERT INTO admin_otp_challenges
             (admin_id, challenge_id, otp_hash, attempts, max_attempts, used, delivery_status, expires_at)
             VALUES (?, ?, ?, 0, 3, 0, 'pending', NOW() + INTERVAL 5 MINUTE)`,
            [adminId, newChallengeId, newOtpHash]
        );

        await conn.commit();
    } catch (txErr) {
        await conn.rollback();
        throw txErr;
    } finally {
        conn.release();
    }

    // --------------------------------------------------------------------------
    // Phase 2: Asynchronous SMTP Transmission (Zero DB locks held)
    // --------------------------------------------------------------------------
    try {
        await sendOtpEmail(adminEmail, newOtp);
    } catch (mailErr) {
        // Fail-closed: permanently invalidate challenge
        await pool.query(
            `UPDATE admin_otp_challenges
             SET delivery_status = 'failed', used = 1
             WHERE challenge_id = ?`,
            [newChallengeId]
        );
        return res.status(500).json({
            message: "Unable to deliver verification email. Please try again."
        });
    }

    // --------------------------------------------------------------------------
    // Phase 3: Activation Transaction
    // --------------------------------------------------------------------------
    const [actResult] = await pool.query(
        `UPDATE admin_otp_challenges
         SET delivery_status = 'sent'
         WHERE challenge_id = ? AND used = 0 AND delivery_status = 'pending'`,
        [newChallengeId]
    );

    if (actResult.affectedRows === 0) {
        return res.status(500).json({
            message: "Verification challenge was superseded or expired during dispatch. Please try again."
        });
    }

    return res.json({
        message: "A new verification code has been dispatched.",
        challengeId: newChallengeId,
        emailMasked: maskEmail(adminEmail),
        expiresInSeconds: 300
    });
});

module.exports = router;