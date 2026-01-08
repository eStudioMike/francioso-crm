const AuthService = require("../services/auth.service");

const AuthController = {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      if (!result.success) {
        return res.status(401).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Errore login:", error);
      res.status(500).json({ error: "Errore interno server" });
    }
  },

  async register(req, res) {
    try {
      const { username, email, password, full_name } = req.body;
      const result = await AuthService.register(username, email, password, full_name);
      
      if (!result.success) {
        return res.status(400).json({ error: result.error });
      }

      res.json(result);
    } catch (error) {
      console.error("Errore register:", error);
      res.status(500).json({ error: "Errore interno server" });
    }
  }
};

module.exports = AuthController;
