// src/app.js
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import routes (non montiamo prima di creare `app`)
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const impiantiRoutes = require("./routes/impianti.routes");

const app = express(); // <- deve venire PRIMA di app.use

// Middlewares globali
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Rotte pubbliche (es. login / register)
app.use("/auth", authRoutes);

// Rotte protette / funzionalità dell'app
app.use("/api/users", userRoutes);

// root
app.get("/", (req, res) => {
  res.send("FranciosoCRM API Running");
});
app.use("/api/impianti", impiantiRoutes);

module.exports = app;

