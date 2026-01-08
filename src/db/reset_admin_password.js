const db = require("../config/db");
const bcrypt = require("bcrypt");

async function resetAdminPassword() {
  try {
    const email = "giuseppearruzza@gmail.com";
    const newPassword = "Admin" + Math.random().toString(36).slice(-10);
    const hash = await bcrypt.hash(newPassword, 12);

    const result = await db.query(
      `UPDATE users
       SET password_hash = $1
       WHERE email = $2
       RETURNING id, email`,
      [hash, email]
    );

    if (result.rowCount === 0) {
      console.log("❌ Nessun utente admin trovato.");
      process.exit();
    }

    console.log("✅ Password admin reimpostata!");
    console.log("📧 Email:", email);
    console.log("🔑 Nuova password:", newPassword);

    process.exit();
  } catch (err) {
    console.error("❌ Errore reset password:", err);
    process.exit(1);
  }
}

resetAdminPassword();
