// src/middlewares/authorize.js
const db = require("../config/db");

/**
 * authorize("preventivi.read")
 * Richiede che l'utente (req.user.role_id) abbia il permesso via role_permissions.
 */
function authorize(permissionName) {
  return async function (req, res, next) {
    try {
      // auth middleware deve aver già settato req.user
      if (!req.user || !req.user.role_id) {
        return res.status(401).json({ error: "Non autorizzato" });
      }

      const roleId = req.user.role_id;

      const q = `
        SELECT 1
        FROM role_permissions rp
        JOIN permissions p ON p.id = rp.permission_id
        WHERE rp.role_id = $1
          AND p.name = $2
        LIMIT 1
      `;

      const result = await db.query(q, [roleId, permissionName]);

      if (result.rowCount === 0) {
        return res.status(403).json({ error: "Permesso insufficiente" });
      }

      next();
    } catch (err) {
      console.error("authorize() error:", err);
      return res.status(500).json({ error: "Errore autorizzazione" });
    }
  };
}

module.exports = authorize;
