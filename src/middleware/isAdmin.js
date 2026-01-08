// src/middleware/isAdmin.js
// Middleware molto semplice che assume che req.user.role_id venga dal JWT (auth middleware)
// Admin è il ruolo con id = 1 (modifica se il tuo id è diverso)

module.exports = function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Utente non autenticato" });
    }

    const roleId = req.user.role_id;

    if (roleId !== 1) {
      return res.status(403).json({ error: "Accesso riservato agli amministratori" });
    }

    next();
  } catch (err) {
    console.error("isAdmin middleware error:", err);
    res.status(500).json({ error: "Errore server" });
  }
};
