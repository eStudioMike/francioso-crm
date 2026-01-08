// src/middleware/checkRole.js
module.exports = function (...allowedRoles) {
  return function (req, res, next) {
    const userRole = req.user.role_id;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Accesso negato: permessi insufficienti" });
    }

    next();
  };
};
