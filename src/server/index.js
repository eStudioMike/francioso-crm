const express = require("express");
const cors = require("cors");

const impiantiRoutes = require("./routes/impianti.routes");

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 REGISTRA DIRETTAMENTE LE ROUTE CHE SERVONO
app.use("/api/impianti", impiantiRoutes);

// Test base
app.get("/", (req, res) => {
  res.json({ message: "API FranciosoCRM attiva 🚀" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});
