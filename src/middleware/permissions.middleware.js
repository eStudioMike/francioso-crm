const db = require("../config/db");

module.exports = function checkPermission(permissionCode) {
  return async (req, res, next) => {
    try {
      const roleId = req.user.role_id;

      const result = await db.query(
        `SELECT 1
         FROM role_permissions rp
         JOIN permissions p ON p.id = rp.permission_id
         WHERE rp.role_id = $1 AND p.code = $2`,
        [roleId, permissionCode]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({ error: "Permesso negato" });
      }

      next();
    } catch (err) {
      console.error("Permission middleware error:", err);
      res.status(500).json({ error: "Errore permessi" });
    }
  };
};
