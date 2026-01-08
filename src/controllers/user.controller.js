const db = require("../config/db");

exports.getAllUsers = async (req, res) => {
  try {
    const result = await db.query("SELECT id, email, full_name, username, role_id, is_active FROM users");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Errore durante il recupero utenti" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query("SELECT id, email, full_name, username, role_id, is_active FROM users WHERE id=$1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Utente non trovato" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Errore nel recupero utente" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { email, username, full_name, password_hash, role_id } = req.body;
    const result = await db.query(
      `INSERT INTO users (email, username, full_name, password_hash, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [email, username, full_name, password_hash, role_id]
    );
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "Errore nella creazione dell'utente" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { email, username, full_name, password_hash, role_id, is_active } = req.body;

    await db.query(
      `UPDATE users
       SET email=$1, username=$2, full_name=$3, password_hash=$4, role_id=$5, is_active=$6
       WHERE id=$7`,
      [email, username, full_name, password_hash, role_id, is_active, id]
    );

    res.json({ message: "Utente aggiornato" });
  } catch (err) {
    res.status(500).json({ error: "Errore durante aggiornamento utente" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await db.query("DELETE FROM users WHERE id=$1", [id]);

    res.json({ message: "Utente eliminato" });
  } catch (err) {
    res.status(500).json({ error: "Errore durante eliminazione utente" });
  }
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // preso dal token

    const result = await db.query(
      "SELECT id, email, full_name, username, role_id, is_active FROM users WHERE id=$1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Profilo non trovato" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Errore nel recupero del profilo" });
  }
};
// REGISTER USER (accesso pubblico)
exports.registerUser = async (req, res) => {
  try {
    const { email, username, full_name, password } = req.body;

    // controlla se email esiste già
    const exists = await db.query("SELECT id FROM users WHERE email=$1", [email]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: "Email già registrata" });
    }

    // hash password
    const bcrypt = require("bcryptjs");
    const password_hash = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (email, username, full_name, password_hash, role_id)
       VALUES ($1, $2, $3, $4, 2)
       RETURNING id`,
      [email, username, full_name, password_hash]
    );

    res.json({ message: "Registrazione completata", id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: "Errore durante la registrazione" });
  }
};
