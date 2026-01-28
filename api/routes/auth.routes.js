module.exports = app => {
  const authController = require("../controllers/auth.controllers");
  const { authenticateToken } = require("../middleware/auth.middleware");
  const router = require("express").Router();

  // POST /api/auth/login - Connexion
  router.post("/login", authController.login);

  // POST /api/auth/register - Inscription
  router.post("/register", authController.register);

  // POST /api/auth/logout - Déconnexion
  router.post("/logout", authController.logout);

  // GET /api/auth/verify - Vérifier le token (protégé)
  router.get("/verify", authenticateToken, authController.verifyToken);

  app.use('/api/auth', router);
};
