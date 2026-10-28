require("dotenv").config();
const nodemailer = require("nodemailer");

/**
 * Check whether required SMTP settings are populated in environment.
 * @returns {boolean}
 */
function isSmtpConfigured() {
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromEmail = process.env.SMTP_FROM_EMAIL;

    return Boolean(
        host && host.trim() &&
        port &&
        user && user.trim() &&
        pass && pass.trim() &&
        fromEmail && fromEmail.trim()
    );
}

/**
 * Creates and returns a Nodemailer transporter using environment variables.
 * @returns {object}
 */
function createTransporter() {
    if (!isSmtpConfigured()) {
        const error = new Error("SMTP server is not configured in server/.env");
        error.code = "SMTP_NOT_CONFIGURED";
        throw error;
    }

    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const isSecure = process.env.SMTP_SECURE === "true" || port === 465;

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST.trim(),
        port: port,
        secure: isSecure,
        auth: {
            user: process.env.SMTP_USER.trim(),
            pass: process.env.SMTP_PASS
        },
        connectionTimeout: 10000, // 10s connection timeout
        greetingTimeout: 10000,   // 10s greeting timeout
        socketTimeout: 15000      // 15s socket timeout
    });
}

/**
 * Sends a 6-digit login verification OTP to the registered administrator email.
 * 
 * @param {string} toEmail - Registered admin recipient email
 * @param {string} otpCode - 6-digit numeric verification code
 * @returns {Promise<{success: boolean, messageId: string}>}
 */
async function sendOtpEmail(toEmail, otpCode) {
    if (typeof toEmail !== "string" || !toEmail.trim() || !toEmail.includes("@")) {
        const error = new Error("Invalid recipient email address");
        error.code = "INVALID_RECIPIENT";
        throw error;
    }

    if (typeof otpCode !== "string" || !/^\d{6}$/.test(otpCode.trim())) {
        const error = new Error("Invalid verification code format");
        error.code = "INVALID_OTP_FORMAT";
        throw error;
    }

    const cleanEmail = toEmail.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    const fromName = (process.env.SMTP_FROM_NAME || "Sharda Welfare Foundation").trim();
    const fromEmail = (process.env.SMTP_FROM_EMAIL || "").trim();
    const fromAddress = fromEmail ? `"${fromName}" <${fromEmail}>` : fromName;

    const subject = "Sharda Welfare Admin - Login Verification Code";

    const textContent = [
        "Sharda Welfare Foundation - Admin Portal Verification",
        "",
        `Your login verification code is: ${cleanOtp}`,
        "",
        "This code is strictly valid for 5 minutes.",
        "Security Notice: Do not share this code with anyone. Foundation staff will never ask for your code.",
        "",
        "If you did not request this login verification code, please disregard this email and secure your administrator credentials immediately.",
        "",
        "Sharda Welfare Foundation"
    ].join("\n");

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb;" cellspacing="0" cellpadding="0">
          <!-- Header -->
          <tr>
            <td style="background-color: #1e3a8a; padding: 24px 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">
                Sharda Welfare Foundation
              </h1>
              <p style="margin: 4px 0 0 0; color: #93c5fd; font-size: 13px; font-weight: 500;">
                Admin Portal Security
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 24px; color: #374151;">
                Hello Administrator,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 22px; color: #4b5563;">
                A sign-in request was initiated for your Sharda Welfare Foundation administrative account. Use the verification code below to complete your login:
              </p>
              <!-- OTP Box -->
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #166534; display: block;">
                  ${cleanOtp}
                </span>
                <span style="font-size: 12px; color: #15803d; font-weight: 600; margin-top: 8px; display: block;">
                  Valid for 5 minutes only
                </span>
              </div>
              <!-- Warnings -->
              <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 24px; border-radius: 0 6px 6px 0;">
                <p style="margin: 0; font-size: 13px; line-height: 18px; color: #92400e; font-weight: 500;">
                  <strong>Security Alert:</strong> Never share this code with anyone. Foundation administrators will never ask for your verification code.
                </p>
              </div>
              <p style="margin: 0; font-size: 12px; line-height: 18px; color: #6b7280;">
                If you did not attempt to sign in, please check your account security immediately.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 16px 32px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #9ca3af;">
                &copy; ${new Date().getFullYear()} Sharda Welfare Foundation. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    try {
        const transporter = createTransporter();

        const info = await transporter.sendMail({
            from: fromAddress,
            to: cleanEmail,
            subject: subject,
            text: textContent,
            html: htmlContent
        });

        return {
            success: true,
            messageId: info.messageId
        };
    } catch (err) {
        // Log sanitized diagnostic without leaking OTP code or credentials
        console.error("Email dispatch failed:", err.code || err.name || "SMTP_DISPATCH_ERROR");

        const publicError = new Error("Failed to send verification email. Please check SMTP configuration.");
        publicError.code = err.code || "SMTP_DISPATCH_FAILED";
        throw publicError;
    }
}

module.exports = {
    isSmtpConfigured,
    createTransporter,
    sendOtpEmail
};
