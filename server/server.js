require("dotenv").config();

const projectRoutes = require("./projects");
const updateRoutes = require("./updates");
const contactRoutes = require("./contact");
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const authRoutes = require("./auth");
const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/updates", updateRoutes);
app.use("/api/contact", contactRoutes);
// Connect to local development database using a connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection pool failed:", err.message);
        return;
    }

    console.log("Connected to local admin database (pool ready)!");
    connection.release();
});

app.get("/", (req, res) => {
    res.send("Sharda Welfare Admin API is running!");
});
// Public API: Return published projects only
app.get("/api/public/projects", (req, res) => {
    db.query(
        `SELECT id, title, subtitle, intro, description, image_url, focus_areas, conclusion, created_at
         FROM projects
         WHERE status = ?
         ORDER BY created_at ASC, id ASC`,
        ["published"],
        (err, results) => {
            if (err) {
                console.error("Public projects error:", err.message);

                return res.status(500).json({
                    message: "Unable to load published projects."
                });
            }

            res.json(results);
        }
    );
});

// Public API: Return published updates only
app.get("/api/public/updates", (req, res) => {
    db.query(
        `SELECT id, slug, title, short_desc, image_url, date_label, display_order, created_at
         FROM updates
         WHERE status = ?
         ORDER BY display_order ASC, created_at DESC`,
        ["published"],
        (err, results) => {
            if (err) {
                console.error("Public updates error:", err.message);
                return res.status(500).json({
                    message: "Unable to load published updates."
                });
            }

            res.json(results);
        }
    );
});

// Public API: Return single published update by slug
app.get("/api/public/updates/:slug", (req, res) => {
    const { slug } = req.params;

    db.query(
        `SELECT id, slug, title, short_desc, content, image_url, date_label, created_at
         FROM updates
         WHERE slug = ? AND status = ?
         LIMIT 1`,
        [slug, "published"],
        (err, results) => {
            if (err) {
                console.error("Single update error:", err.message);
                return res.status(500).json({
                    message: "Unable to load article."
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Article not found."
                });
            }

            res.json(results[0]);
        }
    );
});

// Public API: Return contact settings
app.get("/api/public/contact", (req, res) => {
    db.query(
        `SELECT * FROM contact_settings WHERE id = 1 LIMIT 1`,
        (err, results) => {
            if (err) {
                console.error("Public contact error:", err.message);
                return res.status(500).json({
                    message: "Unable to load contact settings."
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Contact settings not found."
                });
            }

            const row = results[0];
            const parseJson = (val) => {
                if (!val) return [];
                if (Array.isArray(val)) return val;
                if (typeof val === "object") return [val];
                try {
                    const parsed = JSON.parse(val);
                    return Array.isArray(parsed) ? parsed : [];
                } catch {
                    return [];
                }
            };

            res.json({
                ...row,
                additional_phones: parseJson(row.additional_phones),
                additional_emails: parseJson(row.additional_emails),
                additional_addresses: parseJson(row.additional_addresses),
                social_links: parseJson(row.social_links)
            });
        }
    );
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Admin API running at http://localhost:${PORT}`);
});