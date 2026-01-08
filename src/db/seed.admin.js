const db = require("../config/db");
const bcrypt = require("bcrypt");

async function seedAdmin() {
  try {
    const email = "giuseppearruzza@gmail.com";
    const username = "admin"; // obbligatorio perché UNIQUE
    const fullName = "Administrator";
    const plainPassword = "Admin" + Math.random().toString(36).slice(-10);

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const roleId = 1; // admin

    await db.query(
      `INSERT INTO users (username, password_hash, email, full_name, role_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO NOTHING`,
      [username, hashedPassword, email, fullName, roleId]
    );

    console.log("✅ Utente admin creato.");
    console.log("📧 Email:", email);
    console.log("👤 Username:", username);
    console.log("🔑 Password generata:", plainPassword);

    process.exit();
  } catch (error) {
    console.error("❌ Errore creazione admin:", error);
    process.exit(1);
  }
}

seedAdmin();
