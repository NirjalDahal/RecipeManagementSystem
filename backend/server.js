require("dotenv").config();

const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.redirect("/login.html");
});

app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      success: "false",
      message: "Email and password are required",
    });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get("email");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.name}`,
    });
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.post("/api/signup", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }
  try {
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "That email is already registered." });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    ).run(name, email, hashedPassword);
    return res.json({ success: true, message: "Account created!" });
  } catch (err) {
    console.error("Signup error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
