const pool = require("../config/db");

const searchImpianti = async (search) => {
  const query = `
    SELECT
      id,
      nome_impianto,
      provincia,
      comune,
      luogo,
      ubicazione_direzione,
      illuminazione,
      cimasa,
      supporto,
      periodo,
      prezzo_agenzia,
      prezzo_cliente,
      coordinate
    FROM impianti
    WHERE
      nome_impianto ILIKE $1
      OR provincia ILIKE $1
      OR comune ILIKE $1
      OR luogo ILIKE $1
    ORDER BY nome_impianto
    LIMIT 50
  `;

  const { rows } = await pool.query(query, [`%${search}%`]);
  return rows;
};

module.exports = {
  searchImpianti,
};
