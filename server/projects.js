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

// GET: View all projects
router.get("/", verifyAdminToken, (req, res) => {
    db.query(
        "SELECT * FROM projects ORDER BY created_at DESC",
        (err, results) => {
            if (err) {
                console.error("Fetch projects error:", err.message);
                return res.status(500).json({
                    message: "Unable to fetch projects."
                });
            }

            res.json(results);
        }
    );
});

// POST: Create a project
router.post("/", verifyAdminToken, (req, res) => {
    const {
        title,
        subtitle,
        intro,
        description,
        image_url,
        focus_areas,
        conclusion,
        status
    } = req.body;

    if (
        typeof title !== "string" ||
        !title.trim()
    ) {
        return res.status(400).json({
            message: "Project title is required."
        });
    }

    const finalDescription = (typeof intro === "string" && intro.trim())
        ? intro.trim()
        : (typeof description === "string" && description.trim() ? description.trim() : title.trim());

    const projectStatus = status || "draft";

    if (!["draft", "published"].includes(projectStatus)) {
        return res.status(400).json({
            message: "Invalid project status."
        });
    }

    const finalFocusAreas = Array.isArray(focus_areas)
        ? JSON.stringify(focus_areas)
        : (typeof focus_areas === "string" ? focus_areas : null);

    db.query(
        `INSERT INTO projects (title, subtitle, intro, description, image_url, focus_areas, conclusion, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            title.trim(),
            typeof subtitle === "string" && subtitle.trim() ? subtitle.trim() : null,
            typeof intro === "string" && intro.trim() ? intro.trim() : null,
            finalDescription,
            typeof image_url === "string" && image_url.trim() ? image_url.trim() : null,
            finalFocusAreas,
            typeof conclusion === "string" && conclusion.trim() ? conclusion.trim() : null,
            projectStatus
        ],
        (err, result) => {
            if (err) {
                console.error("Create project error:", err.message);
                return res.status(500).json({
                    message: "Unable to create project."
                });
            }

            res.status(201).json({
                message: "Project created successfully.",
                id: result.insertId
            });
        }
    );
});

// PUT: Update a project
router.put("/:id", verifyAdminToken, (req, res) => {
    const {
        title,
        subtitle,
        intro,
        description,
        image_url,
        focus_areas,
        conclusion,
        status
    } = req.body;
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid project ID."
        });
    }

    if (
        typeof title !== "string" ||
        !title.trim()
    ) {
        return res.status(400).json({
            message: "Project title is required."
        });
    }

    const finalDescription = (typeof intro === "string" && intro.trim())
        ? intro.trim()
        : (typeof description === "string" && description.trim() ? description.trim() : title.trim());

    if (!["draft", "published"].includes(status)) {
        return res.status(400).json({
            message: "Invalid project status."
        });
    }

    const finalFocusAreas = Array.isArray(focus_areas)
        ? JSON.stringify(focus_areas)
        : (typeof focus_areas === "string" ? focus_areas : null);

    db.query(
        `UPDATE projects
         SET title = ?, subtitle = ?, intro = ?, description = ?, image_url = ?, focus_areas = ?, conclusion = ?, status = ?
         WHERE id = ?`,
        [
            title.trim(),
            typeof subtitle === "string" && subtitle.trim() ? subtitle.trim() : null,
            typeof intro === "string" && intro.trim() ? intro.trim() : null,
            finalDescription,
            typeof image_url === "string" && image_url.trim() ? image_url.trim() : null,
            finalFocusAreas,
            typeof conclusion === "string" && conclusion.trim() ? conclusion.trim() : null,
            status,
            id
        ],
        (err, result) => {
            if (err) {
                console.error("Update project error:", err.message);
                return res.status(500).json({
                    message: "Unable to update project."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Project not found."
                });
            }

            res.json({
                message: "Project updated successfully."
            });
        }
    );
});

// DELETE: Delete a project
router.delete("/:id", verifyAdminToken, (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid project ID."
        });
    }

    db.query(
        "DELETE FROM projects WHERE id = ?",
        [id],
        (err, result) => {
            if (err) {
                console.error("Delete project error:", err.message);
                return res.status(500).json({
                    message: "Unable to delete project."
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Project not found."
                });
            }

            res.json({
                message: "Project deleted successfully."
            });
        }
    );
});

module.exports = router;