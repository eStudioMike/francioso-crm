module.exports = function requireRoles(...allowedRoles) {
  return (req, res, next) => {
    try {
      if (!req.user?.role_id) {
        return res.status(403).json({ error: "Ruolo utente non presente" });
      }

      // Confrontiamo il ruolo dell’utente con quelli ammessi
      if (!allowedRoles.includes(req.user.role_id)) {
        return res.status(403).json({ error: "Accesso negato: privilegi insufficienti" });
      }

      next();
    } catch (err) {
      console.error("Errore middleware ruoli:", err);
      return res.status(500).json({ error: "Errore interno ruolo" });
    }
  };
};
