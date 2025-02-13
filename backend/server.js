const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(3000, () => {
  console.log("Server läuft auf http://localhost:3000");
});
