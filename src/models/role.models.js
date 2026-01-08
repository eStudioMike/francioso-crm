const db = require("../config/db");

const RoleModel = {
  async getAll() {
    const result = await db.query("SELECT * FROM roles ORDER BY id");
    return result.rows;
  },

  async getById(id) {
    const result = await db.query("SELECT * FROM roles WHERE id = $1", [id]);
    return result.rows[0];
  },

  async getPermissions(roleId) {
    const result = await db.query(
      `
      SELECT p.*
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
      `,
      [roleId]
    );
    return result.rows;
  }
};

module.exports = RoleModel;
