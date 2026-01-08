// src/middleware/role.js
module.exports = function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role_id) {
      return res.status(403).json({ error: "Accesso negato" });
    }

    // Se il ruolo dell’utente è nell’elenco dei ruoli autorizzati → OK
    if (!allowedRoles.includes(req.user.role_id)) {
      return res.status(403).json({ error: "Permessi insufficienti" });
    }

    next();
  };
};
