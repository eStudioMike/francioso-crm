// src/middleware/requireAdmin.js
module.exports = function (req, res, next) {
  if (!req.user || !req.user.role_id) {
    return res.status(403).json({ error: "Accesso negato" });
  }

  // Supponiamo che l'ID ruolo admin = 1
  if (req.user.role_id !== 1) {
    return res.status(403).json({ error: "Non hai i permessi necessari" });
  }

  next();
};
