// src/services/auth.service.js
const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const PasswordResetModel = require("../models/passwordReset.model");

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL;
const FRONTEND_URL = process.env.FRONTEND_URL || "";
const RESET_TOKEN_EXPIRATION_MINUTES = parseInt(process.env.RESET_TOKEN_EXPIRATION_MINUTES || "60", 10);

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: Number(SMTP_PORT) === 465, // true per 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS
  }
});

const AuthService = {
  async login(email, password) {
    const q = await db.query("SELECT * FROM users WHERE email = $1 AND is_active = TRUE", [email]);
    if (q.rowCount === 0) return { success: false, error: "Credenziali non valide" };

    const user = q.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return { success: false, error: "Credenziali non valide" };

    const token = jwt.sign({ id: user.id, email: user.email, role_id: user.role_id }, process.env.JWT_SECRET, { expiresIn: "12h" });
    return { success: true, token, user: { id: user.id, email: user.email, full_name: user.full_name, role_id: user.role_id } };
  },

  // crea token, salva hash in DB e invia mail
  async createPasswordReset(email) {
    // trova utente
    const q = await db.query("SELECT id, email FROM users WHERE email=$1", [email]);
    if (q.rowCount === 0) {
      // Non dire all'utente che l'email non esiste — comportamento sicuro
      return { success: true };
    }
    const user = q.rows[0];

    // genera token (testo puro che mandiamo via email)
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRATION_MINUTES * 60 * 1000);

    // salva
    await PasswordResetModel.create(user.id, tokenHash, expiresAt);

    // costruisci link
    const resetLink = `${FRONTEND_URL.replace(/\/$/, "")}/reset-password?token=${token}&email=${encodeURIComponent(user.email)}`;

    // invia email (semplice template)
    const mailOptions = {
      from: FROM_EMAIL,
      to: user.email,
      subject: "Reset della password - FranciosoCRM",
      text: `Hai richiesto il reset della password. Usa questo link entro ${RESET_TOKEN_EXPIRATION_MINUTES} minuti:\n\n${resetLink}\n\nSe non hai richiesto, ignora questa email.`,
      html: `<p>Hai richiesto il reset della password. Usa questo link entro ${RESET_TOKEN_EXPIRATION_MINUTES} minuti:</p>
             <p><a href="${resetLink}">${resetLink}</a></p>
             <p>Se non hai richiesto, ignora questa email.</p>`
    };

    try {
      await transporter.sendMail(mailOptions);
      return { success: true };
    } catch (err) {
      console.error("Errore invio email reset:", err);
      // se fallisce l'invio, potresti voler cancellare l'entry o loggare; qui restituiamo errore minimo
      return { success: false, error: "Impossibile inviare email" };
    }
  },

  // reset password usando token testuale ricevuto via email
  async resetPassword(token, newPassword) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // cerca record valido
    const row = await PasswordResetModel.findValidByTokenHash(tokenHash);
    if (!row) return { success: false, error: "Token non valido o scaduto" };

    // aggiorna password utente
    const hashed = await bcrypt.hash(newPassword, 12);
    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hashed, row.user_id]);

    // cancella tutti i reset token dell'utente (pulizia)
    await PasswordResetModel.deleteByUserId(row.user_id);

    return { success: true };
  }
};

module.exports = AuthService;
