const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const AuthService = {
  async login(email, password) {
    const userQuery = await db.query(
      "SELECT * FROM users WHERE email = $1 AND is_active = TRUE",
      [email]
    );

    if (userQuery.rowCount === 0) {
      return { success: false, error: "Credenziali non valide" };
    }

    const user = userQuery.rows[0];

    // Controllo password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return { success: false, error: "Credenziali non valide" };
    }

    // Genera token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role_id: user.role_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role_id: user.role_id
      }
    };
  },

  async register(username, email, password, full_name) {
    // Verifica esistenza email
    const check = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (check.rowCount > 0) {
      return { success: false, error: "Email già registrata" };
    }

    const hash = await bcrypt.hash(password, 12);

    await db.query(
      `INSERT INTO users (username, email, password_hash, full_name, is_active) 
       VALUES ($1, $2, $3, $4, TRUE)`,
      [username, email, hash, full_name]
    );

    return { success: true, message: "Registrazione completata" };
  },
};

module.exports = AuthService;
