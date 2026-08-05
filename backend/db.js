require("dotenv").config();
const path = require("path");
const Database = require("better-sqlite3");

const dbFile = process.env.DB_FILE || "database.db";
const db = new Database(path.join(__dirname, dbFile));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

db.exec(`
  CREATE TABLE recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipe_name TEXT NOT NULL,
    recipe_description TEXT NOT NULL,
    category TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    prep_time INTEGER NOT NULL,
    instructions TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);
  `);

console.log(`✅ Database connected successfully (${dbFile})`);

module.exports = db;
