const express = require("express");
const router = express.Router();

router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    message: "FranciosoCRM backend attivo",
    timestamp: new Date()
  });
});

module.exports = router;
