const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const preventivoController = require("../controllers/preventivo.controller");

// Leggere preventivi
router.get(
  "/",
  auth,
  authorize("preventivi.read"),
  preventivoController.getAll
);

// Creare preventivo
router.post(
  "/",
  auth,
  authorize("preventivi.create"),
  preventivoController.create
);

// Modificare preventivo
router.put(
  "/:id",
  auth,
  authorize("preventivi.update"),
  preventivoController.update
);

// Approvare preventivo
router.post(
  "/:id/approve",
  auth,
  authorize("preventivi.approve"),
  preventivoController.approve
);

module.exports = router;
