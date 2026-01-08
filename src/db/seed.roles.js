const db = require("../config/db");

async function seedRoles() {
  try {
    const roles = [
      { id: 1, name: "admin" },
      { id: 2, name: "dirigenza" },
      { id: 3, name: "amministrativo" },
      { id: 4, name: "commerciale" },
      { id: 5, name: "logistica" },
      { id: 6, name: "affissione" }
    ];

    for (const role of roles) {
      await db.query(
        `INSERT INTO roles (id, name)
         VALUES ($1, $2)
         ON CONFLICT (id) DO NOTHING`,
        [role.id, role.name]
      );
    }

    console.log("✅ Ruoli inseriti correttamente.");
    process.exit();
  } catch (error) {
    console.error("❌ Errore inserimento ruoli:", error);
    process.exit(1);
  }
}

seedRoles();
