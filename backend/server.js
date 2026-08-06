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
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password);

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

app.post("/api/recipes", (req, res) => {
  const user_id = req.body.user_id;
  const recipeName = req.body.recipeName;
  const recipeDescription = req.body.recipeDescription;
  const category = req.body.category;
  const cuisine = req.body.cuisine;
  const difficulty = req.body.difficulty;
  const prep_time = req.body.prep_time;
  const instruction = req.body.instruction;

  if (
    !recipeName ||
    !recipeDescription ||
    !category ||
    !cuisine ||
    !prep_time ||
    !instruction ||
    !difficulty
  ) {
    return res.status(400).json({
      success: false,
      message:
        "Name, description, category, cuisine, prep time, and instruction are required",
    });
  }

  try {
    const result = db
      .prepare(
        `INSERT INTO recipes(user_id, recipe_name, recipe_description, category, cuisine, difficulty, prep_time, instructions )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        user_id,
        recipeName,
        recipeDescription,
        category,
        cuisine,
        difficulty,
        prep_time,
        instruction,
      );

    return res.status(201).json({
      success: true,
      message: "Recipe added successfully",
      id: result.lastInsertRowid,
    });
  } catch (e) {
    console.log("Error: ", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving the recipe",
    });
  }
});

app.post("/api/ingredients", (req, res) => {
  const ingredient_name = req.body.ingredient_name;
  const default_unit = req.body.default_unit;

  if (!ingredient_name || !default_unit) {
    return res.status(400).json({
      success: false,
      message: "Ingredient name and default unit is required",
    });
  }

  try {
    const existing = db
      .prepare(
        "SELECT ingredient_id FROM ingredients WHERE ingredient_name = ?",
      )
      .get(ingredient_name);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Ingredient already exists",
      });
    }
    const result = db
      .prepare(
        `INSERT INTO ingredients(ingredient_name, default_unit) VALUES
      (?, ?)`,
      )
      .run(ingredient_name, default_unit);

    return res.status(201).json({
      success: true,
      message: "Ingredient added successfully",
    });
  } catch (e) {
    console.log("Error while inserting ingredients data", e);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
});

app.get("/api/ingredients", (req, res) => {
  try {
    const ingredients = db
      .prepare(
        "SELECT ingredient_id, ingredient_name, default_unit FROM ingredients",
      )
      .all();

    res.json(ingredients);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Failed to load ingredients",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
