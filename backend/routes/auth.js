require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "fallback-secret";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  console.log("Registrierungsanfrage empfangen:", { username, password });

  if (!username || !password) {
    console.log("Fehler: Felder nicht ausgefüllt.");
    return res.status(400).json({ message: "Alle Felder ausfüllen" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        console.error(
          "Datenbankfehler beim Überprüfen des Benutzernamens:",
          err
        );
        return res.status(500).json({ message: "Datenbankfehler" });
      }

      if (result.length > 0) {
        console.log("Benutzername existiert bereits:", username);
        return res
          .status(400)
          .json({ message: "Benutzername existiert bereits" });
      }

      try {
        console.log("Hashing des Passworts...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Passwort gehasht.");

        db.query(
          "INSERT INTO users (username, password) VALUES (?, ?)",
          [username, hashedPassword],
          (err) => {
            if (err) {
              console.error("Fehler bei der Registrierung:", err);
              return res
                .status(500)
                .json({ message: "Fehler bei der Registrierung" });
            }

            console.log("Benutzer erfolgreich registriert:", username);
            res.status(201).json({ message: "Registrierung erfolgreich" });
          }
        );
      } catch (error) {
        console.error("Fehler beim Hashing des Passworts:", error);
        res.status(500).json({ message: "Interner Fehler" });
      }
    }
  );
});

// Login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Alle Felder ausfüllen" });
  }

  db.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Datenbankfehler" });
      }
      if (result.length === 0) {
        return res
          .status(400)
          .json({ message: "Benutzername oder Passwort ist falsch" });
      }

      const user = result[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Benutzername oder Passwort ist falsch" });
      }

      // JWT generieren
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: "1h",
      });

      res.json({ message: "Login erfolgreich", token });
    }
  );
});

module.exports = router;
