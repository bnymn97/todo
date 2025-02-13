const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const jwtSecret = "super-secret-key";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Nicht autorisiert" });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Ungültiges Token" });
    }
    req.userId = user.id;
    next();
  });
}

router.post("/create", authenticateToken, (req, res) => {
  const { task_text } = req.body;
  const userId = req.userId;

  if (!task_text) {
    return res
      .status(400)
      .json({ message: "Aufgabentext darf nicht leer sein" });
  }

  db.query(
    "INSERT INTO tasks (user_id, task_text) VALUES (?, ?)",
    [userId, task_text],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Fehler beim Speichern der Aufgabe" });
      }
      res.status(201).json({ message: "Aufgabe erfolgreich hinzugefügt" });
    }
  );
});

router.get("/", authenticateToken, (req, res) => {
  const userId = req.userId;
  const { completed } = req.query;

  let query = "SELECT * FROM tasks WHERE user_id = ?";
  const params = [userId];

  if (completed === "true") {
    query += " AND completed = true";
  } else if (completed === "false") {
    query += " AND completed = false";
  }

  db.query(query, params, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Fehler beim Abrufen der Aufgaben" });
    }
    res.json(result);
  });
});

router.patch("/:id/complete", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  db.query(
    "UPDATE tasks SET completed = true WHERE id = ? AND user_id = ?",
    [taskId, userId],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Fehler beim Aktualisieren der Aufgabe" });
      }
      res
        .status(200)
        .json({ message: "Aufgabe erfolgreich als erledigt markiert" });
    }
  );
});

router.put("/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;
  const { task_text } = req.body;

  if (!task_text) {
    return res
      .status(400)
      .json({ message: "Aufgabentext darf nicht leer sein" });
  }

  db.query(
    "UPDATE tasks SET task_text = ? WHERE id = ? AND user_id = ?",
    [task_text, taskId, userId],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Fehler beim Bearbeiten der Aufgabe" });
      }
      res.status(200).json({ message: "Aufgabe erfolgreich bearbeitet" });
    }
  );
});

router.delete("/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;

  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [taskId, userId],
    (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Fehler beim Löschen der Aufgabe" });
      }
      res.status(200).json({ message: "Aufgabe erfolgreich gelöscht" });
    }
  );
});

module.exports = router;
