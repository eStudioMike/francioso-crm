const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// Profilo utente loggato
router.get("/profile", auth, userController.getProfile);

// ROUTE SOLO ADMIN
router.get("/", auth, isAdmin, userController.getAllUsers);

// ROUTE SOLO ADMIN
router.get("/:id", auth, isAdmin, userController.getUserById);

// Registrazione utente (pubblica)
router.post("/register", userController.registerUser);


module.exports = router;
