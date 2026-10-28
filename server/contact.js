const express = require("express");
const mysql = require("mysql2");
const verifyAdminToken = require("./middleware");

const router = express.Router();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

// Helper to safely parse JSON array fields
function parseJsonArray(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") return [value];
    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Helper to format a database row into a structured contact settings object
function formatContactRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        helpline_number: row.helpline_number || "",
        helpline_tel: row.helpline_tel || "",
        footer_phone: row.footer_phone || "",
        official_email: row.official_email || "",
        campus_address: row.campus_address || "",
        campus_address_multiline: row.campus_address_multiline || "",
        office_hours: row.office_hours || "",
        email_response_time: row.email_response_time || "",
        whatsapp_number: row.whatsapp_number || "",
        whatsapp_url: row.whatsapp_url || "",
        map_embed_url: row.map_embed_url || "",
        map_directions_url: row.map_directions_url || "",
        additional_phones: parseJsonArray(row.additional_phones),
        additional_emails: parseJsonArray(row.additional_emails),
        additional_addresses: parseJsonArray(row.additional_addresses),
        social_links: parseJsonArray(row.social_links),
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

// Validate and serialize JSON array fields, rejecting malformed structures
function validateAndSerializeJsonArray(value, fieldName) {
    if (value === undefined || value === null) {
        return "[]";
    }

    let parsed = value;
    if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed === "") {
            return "[]";
        }
        try {
            parsed = JSON.parse(trimmed);
        } catch (err) {
            throw new Error(`Invalid JSON format in '${fieldName}': ${err.message}`);
        }
    }

    if (!Array.isArray(parsed)) {
        throw new Error(`Field '${fieldName}' must be an array or JSON-encoded array.`);
    }

    if (fieldName === "social_links") {
        for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            if (!item || typeof item !== "object" || Array.isArray(item)) {
                throw new Error(`Item ${i + 1} in 'social_links' must be an object.`);
            }
            if (typeof item.platform !== "string" || !item.platform.trim()) {
                throw new Error(`Item ${i + 1} in 'social_links' must contain a valid 'platform' string.`);
            }
            if (typeof item.is_enabled !== "boolean" && item.is_enabled !== 0 && item.is_enabled !== 1) {
                throw new Error(`Item ${i + 1} in 'social_links' must contain a boolean 'is_enabled' property.`);
            }
        }
    } else if (["additional_phones", "additional_emails", "additional_addresses"].includes(fieldName)) {
        for (let i = 0; i < parsed.length; i++) {
            const item = parsed[i];
            if (!item || (typeof item !== "object" && typeof item !== "string")) {
                throw new Error(`Item ${i + 1} in '${fieldName}' must be an object or string.`);
            }
        }
    }

    return JSON.stringify(parsed);
}

// Public GET: Return contact settings (no auth required)
router.get("/public", (req, res) => {
    db.query(
        `SELECT * FROM contact_settings WHERE id = 1 LIMIT 1`,
        (err, results) => {
            if (err) {
                console.error("Public contact fetch error:", err.message);
                return res.status(500).json({ message: "Unable to load contact settings." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Contact settings not found." });
            }

            res.json(formatContactRow(results[0]));
        }
    );
});

// Protected GET: Return contact settings (Admin only)
router.get("/", verifyAdminToken, (req, res) => {
    db.query(
        `SELECT * FROM contact_settings WHERE id = 1 LIMIT 1`,
        (err, results) => {
            if (err) {
                console.error("Fetch contact settings error:", err.message);
                return res.status(500).json({ message: "Unable to fetch contact settings." });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Contact settings not found." });
            }

            res.json(formatContactRow(results[0]));
        }
    );
});

// Helper function to handle update logic
function handleUpdate(req, res) {
    const {
        helpline_number,
        helpline_tel,
        footer_phone,
        official_email,
        campus_address,
        campus_address_multiline,
        office_hours,
        email_response_time,
        whatsapp_number,
        whatsapp_url,
        map_embed_url,
        map_directions_url,
        additional_phones,
        additional_emails,
        additional_addresses,
        social_links
    } = req.body;

    if (typeof helpline_number !== "string" || !helpline_number.trim()) {
        return res.status(400).json({ message: "Helpline number is required." });
    }
    if (typeof official_email !== "string" || !official_email.trim()) {
        return res.status(400).json({ message: "Official email is required." });
    }
    if (typeof campus_address !== "string" || !campus_address.trim()) {
        return res.status(400).json({ message: "Campus address is required." });
    }

    let finalAdditionalPhones, finalAdditionalEmails, finalAdditionalAddresses, finalSocialLinks;
    try {
        finalAdditionalPhones = validateAndSerializeJsonArray(additional_phones, "additional_phones");
        finalAdditionalEmails = validateAndSerializeJsonArray(additional_emails, "additional_emails");
        finalAdditionalAddresses = validateAndSerializeJsonArray(additional_addresses, "additional_addresses");
        finalSocialLinks = validateAndSerializeJsonArray(social_links, "social_links");
    } catch (valErr) {
        return res.status(400).json({ message: valErr.message });
    }

    const cleanedHelpline = helpline_number.trim();
    const cleanedHelplineTel = (typeof helpline_tel === "string" && helpline_tel.trim())
        ? helpline_tel.trim()
        : cleanedHelpline.replace(/[\s-]/g, "");
    const cleanedFooterPhone = (typeof footer_phone === "string" && footer_phone.trim())
        ? footer_phone.trim()
        : cleanedHelpline;
    const cleanedEmail = official_email.trim();
    const cleanedAddress = campus_address.trim();
    const cleanedAddressMulti = (typeof campus_address_multiline === "string" && campus_address_multiline.trim())
        ? campus_address_multiline.trim()
        : cleanedAddress;
    const cleanedHours = (typeof office_hours === "string" && office_hours.trim())
        ? office_hours.trim()
        : "Mon – Sat, 9:00 AM – 6:00 PM IST";
    const cleanedEmailResponse = (typeof email_response_time === "string" && email_response_time.trim())
        ? email_response_time.trim()
        : "Replies typically within 24–48 hours";
    const cleanedWhatsappNumber = (typeof whatsapp_number === "string" && whatsapp_number.trim())
        ? whatsapp_number.trim()
        : cleanedHelpline;
    const cleanedWhatsappUrl = (typeof whatsapp_url === "string" && whatsapp_url.trim())
        ? whatsapp_url.trim()
        : "";
    const cleanedMapEmbed = (typeof map_embed_url === "string" && map_embed_url.trim())
        ? map_embed_url.trim()
        : "";
    const cleanedMapDirections = (typeof map_directions_url === "string" && map_directions_url.trim())
        ? map_directions_url.trim()
        : "";

    const sql = `
        UPDATE contact_settings
        SET helpline_number = ?,
            helpline_tel = ?,
            footer_phone = ?,
            official_email = ?,
            campus_address = ?,
            campus_address_multiline = ?,
            office_hours = ?,
            email_response_time = ?,
            whatsapp_number = ?,
            whatsapp_url = ?,
            map_embed_url = ?,
            map_directions_url = ?,
            additional_phones = ?,
            additional_emails = ?,
            additional_addresses = ?,
            social_links = ?
        WHERE id = 1
    `;

    db.query(
        sql,
        [
            cleanedHelpline,
            cleanedHelplineTel,
            cleanedFooterPhone,
            cleanedEmail,
            cleanedAddress,
            cleanedAddressMulti,
            cleanedHours,
            cleanedEmailResponse,
            cleanedWhatsappNumber,
            cleanedWhatsappUrl,
            cleanedMapEmbed,
            cleanedMapDirections,
            finalAdditionalPhones,
            finalAdditionalEmails,
            finalAdditionalAddresses,
            finalSocialLinks
        ],
        (err, result) => {
            if (err) {
                console.error("Update contact settings error:", err.message);
                return res.status(500).json({ message: "Unable to update contact settings." });
            }

            db.query(
                `SELECT * FROM contact_settings WHERE id = 1 LIMIT 1`,
                (fetchErr, fetchResults) => {
                    if (fetchErr || fetchResults.length === 0) {
                        return res.json({
                            message: "Contact settings updated successfully.",
                            affectedRows: result.affectedRows
                        });
                    }

                    res.json({
                        message: "Contact settings updated successfully.",
                        settings: formatContactRow(fetchResults[0])
                    });
                }
            );
        }
    );
}

// Protected PUT: Update contact settings (Admin only)
router.put("/", verifyAdminToken, (req, res) => {
    handleUpdate(req, res);
});

router.put("/:id", verifyAdminToken, (req, res) => {
    handleUpdate(req, res);
});

module.exports = router;
