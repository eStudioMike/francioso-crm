const db = require("../config/db");

const PermissionModel = {
  async getAll() {
    const result = await db.query("SELECT * FROM permissions ORDER BY id");
    return result.rows;
  },

  async getById(id) {
    const result = await db.query("SELECT * FROM permissions WHERE id = $1", [id]);
    return result.rows[0];
  }
};

module.exports = PermissionModel;
