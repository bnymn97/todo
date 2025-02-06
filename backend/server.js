const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware
app.use(bodyParser.json());

// Statische Dateien bereitstellen
app.use(express.static(path.join(__dirname, "../public")));

// API-Routen
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Alle anderen GET-Anfragen an die index.html weiterleiten
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Server starten
app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
