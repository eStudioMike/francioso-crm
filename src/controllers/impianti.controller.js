const ImpiantiService = require("../services/impianti.service");

const search = async (req, res) => {
  try {
    const { q } = req.query;
    const impianti = await ImpiantiService.searchImpianti(q);
    res.json(impianti);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore ricerca impianti" });
  }
};

module.exports = { search };
