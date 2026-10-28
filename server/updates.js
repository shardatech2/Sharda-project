const express = require("express");
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");
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

// Helper to generate a clean URL slug
function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[\s\W-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// GET: View all updates (Admin)
router.get("/", verifyAdminToken, (req, res) => {
    db.query(
        "SELECT * FROM updates ORDER BY display_order ASC, created_at DESC",
        (err, results) => {
            if (err) {
                console.error("Fetch updates error:", err.message);
                return res.status(500).json({
                    message: "Unable to fetch updates."
                });
            }

            res.json(results);
        }
    );
});

// POST: Upload an image file for updates (saves to public/latest-updates)
router.post("/upload-image", verifyAdminToken, (req, res) => {
    const { filename, base64Data } = req.body;

    if (!filename || !base64Data) {
        return res.status(400).json({
            message: "Filename and image data are required."
        });
    }

    try {
        const ext = path.extname(filename).toLowerCase();
        const allowedExts = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

        if (!allowedExts.includes(ext)) {
            return res.status(400).json({
                message: "Only raster image files (jpg, jpeg, png, webp, gif) are allowed."
            });
        }

        // Clean base64 data header if present
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(cleanBase64, "base64");

        const safeBaseName = path
            .basename(filename, ext)
            .replace(/[^a-zA-Z0-9_-]/g, "_");
        const uniqueFileName = `${safeBaseName}_${Date.now()}${ext}`;
        const targetDir = path.join(__dirname, "../public/latest-updates");

        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const targetFilePath = path.join(targetDir, uniqueFileName);
        fs.writeFileSync(targetFilePath, buffer);

        const publicUrl = `/latest-updates/${uniqueFileName}`;
        return res.json({
            message: "Image uploaded successfully.",
            imageUrl: publicUrl
        });
    } catch (error) {
        console.error("Image upload error:", error.message);
        return res.status(500).json({
            message: "Failed to upload image. Please try again."
        });
    }
});

// POST: Create a new update (Admin)
router.post("/", verifyAdminToken, (req, res) => {
    const {
        title,
        slug,
        short_desc,
        content,
        image_url,
        date_label,
        display_order,
        status
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Article title is required." });
    }

    if (!short_desc || typeof short_desc !== "string" || !short_desc.trim()) {
        return res.status(400).json({ message: "Short description is required." });
    }

    if (!content) {
        return res.status(400).json({ message: "Article content is required." });
    }

    if (!image_url || typeof image_url !== "string" || !image_url.trim()) {
        return res.status(400).json({ message: "Image URL or uploaded image is required." });
    }

    const finalSlug = slug && typeof slug === "string" && slug.trim()
        ? generateSlug(slug)
        : generateSlug(title);

    if (!finalSlug) {
        return res.status(400).json({ message: "Valid slug could not be determined." });
    }

    let formattedContent = content;
    if (Array.isArray(content)) {
        formattedContent = JSON.stringify(content);
    } else if (typeof content === "string") {
        const paragraphs = content.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
        formattedContent = JSON.stringify(paragraphs.length > 0 ? paragraphs : [content.trim()]);
    }

    const finalOrder = Number.isInteger(Number(display_order)) ? Number(display_order) : 0;
    const finalStatus = ["draft", "published"].includes(status) ? status : "draft";

    const insertSql = `
        INSERT INTO updates 
          (slug, title, short_desc, content, image_url, date_label, display_order, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        insertSql,
        [
            finalSlug,
            title.trim(),
            short_desc.trim(),
            formattedContent,
            image_url.trim(),
            date_label && typeof date_label === "string" ? date_label.trim() : null,
            finalOrder,
            finalStatus
        ],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "An article with this URL slug already exists. Please use a unique slug."
                    });
                }
                console.error("Create update error:", err.message);
                return res.status(500).json({ message: "Unable to create update." });
            }

            res.status(201).json({
                message: "Update created successfully.",
                id: result.insertId,
                slug: finalSlug
            });
        }
    );
});

// PUT: Edit an existing update (Admin)
router.put("/:id", verifyAdminToken, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid update ID." });
    }

    const {
        title,
        slug,
        short_desc,
        content,
        image_url,
        date_label,
        display_order,
        status
    } = req.body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Article title is required." });
    }

    if (!short_desc || typeof short_desc !== "string" || !short_desc.trim()) {
        return res.status(400).json({ message: "Short description is required." });
    }

    if (!content) {
        return res.status(400).json({ message: "Article content is required." });
    }

    if (!image_url || typeof image_url !== "string" || !image_url.trim()) {
        return res.status(400).json({ message: "Image URL or uploaded image is required." });
    }

    const finalSlug = slug && typeof slug === "string" && slug.trim()
        ? generateSlug(slug)
        : generateSlug(title);

    let formattedContent = content;
    if (Array.isArray(content)) {
        formattedContent = JSON.stringify(content);
    } else if (typeof content === "string") {
        const paragraphs = content.split(/\r?\n\r?\n/).map(p => p.trim()).filter(Boolean);
        formattedContent = JSON.stringify(paragraphs.length > 0 ? paragraphs : [content.trim()]);
    }

    const finalOrder = Number.isInteger(Number(display_order)) ? Number(display_order) : 0;
    const finalStatus = ["draft", "published"].includes(status) ? status : "draft";

    const updateSql = `
        UPDATE updates
        SET slug = ?, title = ?, short_desc = ?, content = ?, image_url = ?, date_label = ?, display_order = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        updateSql,
        [
            finalSlug,
            title.trim(),
            short_desc.trim(),
            formattedContent,
            image_url.trim(),
            date_label && typeof date_label === "string" ? date_label.trim() : null,
            finalOrder,
            finalStatus,
            id
        ],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({
                        message: "Another article is already using this URL slug. Please choose a different slug."
                    });
                }
                console.error("Update error:", err.message);
                return res.status(500).json({ message: "Unable to update article." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Article not found." });
            }

            res.json({ message: "Article updated successfully." });
        }
    );
});

// DELETE: Delete an update (Admin)
router.delete("/:id", verifyAdminToken, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Invalid update ID." });
    }

    db.query("DELETE FROM updates WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error("Delete update error:", err.message);
            return res.status(500).json({ message: "Unable to delete update." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Article not found." });
        }

        res.json({ message: "Article deleted successfully." });
    });
});

module.exports = router;
