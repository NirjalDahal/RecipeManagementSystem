require("dotenv").config();
const path = require("path");
const Database = require("better-sqlite3");

const dbFile = process.env.DB_FILE || "database.db";
const db = new Database(path.join(__dirname, dbFile));

await db.execute(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS recipes (
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

await db.execute(`
  CREATE TABLE IF NOT EXISTS ingredients(
    ingredient_id INTEGER PRIMARY KEY AUTOINCREMENT,
    ingredient_name VARCHAR(100) NOT NULL UNIQUE,
    default_unit VARCHAR(20) NOT NULL
  )
`);

console.log(`✅ Database connected successfully (${dbFile})`);

module.exports = db;
