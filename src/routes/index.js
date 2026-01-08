const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Router principale di FranciosoCRM" });
});

// Rotte utenti
router.use("/users", require("./user.routes"));

// Rotte autenticazione
router.use("/auth", require("./auth.routes"));

module.exports = router;
