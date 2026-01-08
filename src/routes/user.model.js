const db = require("../config/db");

const UserModel = {
  async getAll() {
    const result = await db.query("SELECT id, username, email, full_name, role_id, is_active FROM users");
    return result.rows;
  },

  async getById(id) {
    const result = await db.query(
      "SELECT id, username, email, full_name, role_id, is_active FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0];
  }
};

module.exports = UserModel;
