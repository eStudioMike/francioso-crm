// src/controllers/auth.controller.js
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// -----------------------
// LOGIN UTENTE
// -----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query(
      "SELECT id, email, username, full_name, password_hash, role_id, is_active FROM users WHERE email=$1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: "Email o password non validi" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch)
      return res.status(401).json({ error: "Email o password non validi" });

    if (!user.is_active)
      return res.status(403).json({ error: "Utente disattivato" });

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login effettuato",
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        username: user.username,
        role_id: user.role_id
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ error: "Errore server" });
  }
};

// -----------------------
// REGISTRAZIONE
// -----------------------
exports.register = async (req, res) => {
  try {
    const { email, username, full_name, password } = req.body;

    if (!email || !username || !password)
      return res.status(400).json({ error: "Email, username e password sono obbligatori" });

    const emailCheck = await db.query("SELECT id FROM users WHERE email = $1", [email]);

    if (emailCheck.rows.length > 0)
      return res.status(400).json({ error: "Email già registrata" });

    const password_hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (email, username, full_name, password_hash, role_id)
       VALUES ($1, $2, $3, $4, 2)
       RETURNING id, email, username, full_name, role_id`,
      [email, username, full_name, password_hash]
    );

    res.json({
      message: "Registrazione completata",
      user: result.rows[0]
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ error: "Errore server" });
  }
};

// -----------------------
// PASSWORD FORGOTTEN
// -----------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Email non trovata" });

    const userId = result.rows[0].id;

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    await db.query(
      `UPDATE users
       SET reset_token=$1, reset_token_expire=NOW() + INTERVAL '1 hour'
       WHERE id=$2`,
      [hashedToken, userId]
    );

    const resetLink = `https://TUO-SITO/reset-password/${resetToken}`;

    res.json({
      message: "Link reset generato",
      resetLink
    });

  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ error: "Errore server" });
  }
};

// -----------------------
// RESET PASSWORD
// -----------------------
exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const result = await db.query(
      `SELECT id FROM users
       WHERE reset_token=$1 AND reset_token_expire > NOW()`,
      [hashedToken]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ error: "Token non valido o scaduto" });

    const userId = result.rows[0].id;

    const { newPassword } = req.body;
    const newHash = await bcrypt.hash(newPassword, 10);

    await db.query(
      `UPDATE users
       SET password_hash=$1, reset_token=NULL, reset_token_expire=NULL
       WHERE id=$2`,
      [newHash, userId]
    );

    res.json({ message: "Password aggiornata" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ error: "Errore server" });
  }
};
