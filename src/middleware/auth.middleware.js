const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (requiredPermission = null) => {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Token mancante" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // { id, username, role, permissions }

      // Se non è richiesto alcun permesso, passa
      if (!requiredPermission) {
        return next();
      }

      // Controllo permessi
      if (!decoded.permissions.includes(requiredPermission)) {
        return res.status(403).json({ message: "Permesso negato" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Token non valido" });
    }
  };
};


// 🔐 Verifica token
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).json({ message: "Token mancante" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token non valido" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role_id, email }
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token non valido o scaduto" });
    }
}

// 🔐 Richiede un ruolo specifico
function requireRole(roleId) {
    return (req, res, next) => {
        if (req.user.role_id !== roleId) {
            return res.status(403).json({ message: "Accesso negato. Ruolo non autorizzato." });
        }
        next();
    };
}

// 🔐 Richiede un permesso specifico
function requirePermission(permission) {
    return async (req, res, next) => {
        const db = require("../config/db");

        try {
            const result = await db.query(
                `SELECT p.name FROM permissions p
                 JOIN role_permissions rp ON p.id = rp.permission_id
                 WHERE rp.role_id = $1`,
                [req.user.role_id]
            );

            const permissions = result.rows.map(p => p.name);

            if (!permissions.includes(permission)) {
                return res.status(403).json({ message: "Permesso negato: " + permission });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Errore verifica permessi" });
        }
    };
}

module.exports = {
    verifyToken,
    requireRole,
    requirePermission
};
