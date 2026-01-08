const db = require("../config/db");

const permissions = [
  // Global
  "view_users",
  "create_users",
  "edit_users",
  "delete_users",
  "assign_roles",

  // Amministrativo
  "view_invoices",
  "manage_invoices",
  "view_payments",
  "manage_payments",

  // Commerciale
  "view_clients",
  "manage_clients",
  "view_campaigns",
  "manage_campaigns",

  // Logistica
  "view_material",
  "manage_material",
  "view_routes",
  "manage_routes",

  // Affissione
  "view_affissioni",
  "manage_affissioni",
  "upload_photos",

  // Dirigenza
  "view_reports",
  "view_financials"
];

async function seedPermissions() {
  try {
    for (const perm of permissions) {
      await db.query(
        "INSERT INTO permissions (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
        [perm]
      );
    }

    console.log("Permessi inseriti con successo.");
    process.exit();
  } catch (error) {
    console.error("Errore inserimento permessi:", error);
    process.exit(1);
  }
}

seedPermissions();
