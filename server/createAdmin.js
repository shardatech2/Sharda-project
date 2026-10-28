require("dotenv").config();

const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter admin name: ", (name) => {
    rl.question("Enter admin email: ", (email) => {
        rl.question("Create admin password: ", async (password) => {
            try {
                if (!name.trim() || !email.trim() || password.length < 8) {
                    console.log("Name and email are required. Password must be at least 8 characters.");
                    rl.close();
                    db.end();
                    return;
                }

                const hashedPassword = await bcrypt.hash(password, 12);

                db.query(
                    "INSERT INTO admin_users (name, email, password) VALUES (?, ?, ?)",
                    [name.trim(), email.trim().toLowerCase(), hashedPassword],
                    (err) => {
                        if (err) {
                            console.error("Could not create admin:", err.message);
                        } else {
                            console.log("Admin account created successfully!");
                        }

                        rl.close();
                        db.end();
                    }
                );
            } catch (err) {
                console.error("Error:", err.message);
                rl.close();
                db.end();
            }
        });
    });
});