// src/models/passwordReset.model.js
const db = require("../config/db");

const PasswordResetModel = {
  async create(userId, tokenHash, expiresAt) {
    return db.query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at)
       VALUES ($1, $2, $3)`,
      [userId, tokenHash, expiresAt]
    );
  },

  // trova il primo token valido (non scaduto)
  async findValidByTokenHash(tokenHash) {
    const res = await db.query(
      `SELECT * FROM password_resets 
       WHERE token_hash = $1 AND expires_at > NOW()
       ORDER BY created_at DESC
       LIMIT 1`,
      [tokenHash]
    );
    return res.rows[0];
  },

  async deleteByUserId(userId) {
    return db.query(`DELETE FROM password_resets WHERE user_id = $1`, [userId]);
  }
};

module.exports = PasswordResetModel;
