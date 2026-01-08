const db = require("../config/db");

module.exports = function hasPermission(permissionCode) {
  return async (req, res, next) => {
    try {
      const userRoleId = req.user.role_id;

      const result = await db.query(
        `
        SELECT 1
        FROM role_permissions rp
        JOIN permissions p ON p.id = rp.permission_id
        WHERE rp.role_id = $1 AND p.code = $2
        `,
        [userRoleId, permissionCode]
      );

      if (result.rowCount === 0) {
        return res.status(403).json({ error: "Permesso negato" });
      }

      next();
    } catch (err) {
      console.error("Errore permessi:", err);
      res.status(500).json({ error: "Errore verifica permessi" });
    }
  };
};
