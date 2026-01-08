const db = require("../config/db");

async function seedRolePermissions() {
  try {
    // Fetch all permissions
    const permRes = await db.query("SELECT id, name FROM permissions");
    const permissions = permRes.rows;

    // Helper: trova permesso per nome
    function getPermId(name) {
      return permissions.find(p => p.name === name)?.id;
    }

    // DEFINIZIONE PERMESSI PER RUOLO
    const rolePermissions = {
      1: permissions.map(p => p.id), // ADMIN → tutti i permessi

      2: permissions
        .filter(p => p.name.startsWith("view_") || p.name === "view_reports" || p.name === "view_financials")
        .map(p => p.id),

      3: [
        getPermId("view_invoices"),
        getPermId("manage_invoices"),
        getPermId("view_payments"),
        getPermId("manage_payments")
      ],

      4: [
        getPermId("view_clients"),
        getPermId("manage_clients"),
        getPermId("view_campaigns"),
        getPermId("manage_campaigns")
      ],

      5: [
        getPermId("view_material"),
        getPermId("manage_material"),
        getPermId("view_routes"),
        getPermId("manage_routes")
      ],

      6: [
        getPermId("view_affissioni"),
        getPermId("manage_affissioni"),
        getPermId("upload_photos")
      ],
    };

    // Inserimento ruolo → permessi
    for (const roleId of Object.keys(rolePermissions)) {
      for (const permId of rolePermissions[roleId]) {
        if (!permId) continue; // skip se permesso non trovato

        await db.query(
          `
          INSERT INTO role_permissions (role_id, permission_id)
          VALUES ($1, $2)
          ON CONFLICT DO NOTHING
        `,
          [roleId, permId]
        );
      }
    }

    console.log("✅ Permessi assegnati ai ruoli con successo.");
    process.exit();
  } catch (error) {
    console.error("❌ Errore durante assegnazione permessi ai ruoli:", error);
    process.exit(1);
  }
}

seedRolePermissions();
