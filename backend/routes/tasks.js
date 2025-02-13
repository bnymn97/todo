const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET || "fallback-secret";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.userId = user.id;
    next();
  });
}

router.post("/create", authenticateToken, (req, res) => {
  const { task_text } = req.body;
  const userId = req.userId;

  if (!task_text) {
    return res.status(400).json({ message: "Task text cannot be empty" });
  }

  db.query(
    "INSERT INTO tasks (user_id, task_text) VALUES (?, ?)",
    [userId, task_text],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Error saving task" });
      }
      res.status(201).json({ message: "Task added successfully" });
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
      return res.status(500).json({ message: "Error fetching tasks" });
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
        return res.status(500).json({ message: "Error updating task" });
      }
      res
        .status(200)
        .json({ message: "Task successfully marked as completed" });
    }
  );
});

router.put("/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const userId = req.userId;
  const { task_text } = req.body;

  if (!task_text) {
    return res.status(400).json({ message: "Task text cannot be empty" });
  }

  db.query(
    "UPDATE tasks SET task_text = ? WHERE id = ? AND user_id = ?",
    [task_text, taskId, userId],
    (err) => {
      if (err) {
        return res.status(500).json({ message: "Error updating task" });
      }
      res.status(200).json({ message: "Task updated successfully" });
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
        return res.status(500).json({ message: "Error deleting task" });
      }
      res.status(200).json({ message: "Task deleted successfully" });
    }
  );
});

module.exports = router;
