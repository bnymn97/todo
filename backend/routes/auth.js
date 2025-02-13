require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "fallback-secret";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  console.log("Registration request received:", { username, password });

  if (!username || !password) {
    console.log("Error: All fields must be filled in.");
    return res.status(400).json({ message: "Please fill out all fields" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.error("Database error while checking username:", err);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        console.log("Username already exists:", username);
        return res.status(400).json({ message: "Username already exists" });
      }

      try {
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed.");

        db.query(
          "INSERT INTO users (username, password) VALUES (?, ?)",
          [username, hashedPassword],
          (err) => {
            if (err) {
              console.error("Error during registration:", err);
              return res
                .status(500)
                .json({ message: "Error during registration" });
            }

            console.log("User registered successfully:", username);
            res.status(201).json({ message: "Registration successful" });
          }
        );
      } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Internal error" });
      }
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      if (result.length === 0) {
        return res
          .status(400)
          .json({ message: "Username or password is incorrect" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Username or password is incorrect" });
      }

      // Generate JWT
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: "1h",
      });

      res.json({ message: "Login successful", token });
    }
  );
});

module.exports = router;
