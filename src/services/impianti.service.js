const ImpiantiModel = require("../models/impianti.model");

const searchImpianti = async (q) => {
  if (!q || q.length < 2) return [];
  return await ImpiantiModel.searchImpianti(q);
};

module.exports = { searchImpianti };
