module.exports = app => {
  const favorites = require("../controllers/favorites.controllers.js");
  const { authenticateToken } = require("../middleware/auth.middleware");

  var router = require("express").Router();

  // Toutes les routes nécessitent une authentification
  
  // GET /api/favorites - Liste des favoris de l'utilisateur
  router.get("/", authenticateToken, favorites.getUserFavorites);

  // POST /api/favorites - Ajouter un favori
  router.post("/", authenticateToken, favorites.addFavorite);

  // ⚠️ IMPORTANT : /clear DOIT être AVANT /:pollutionId
  // Sinon "clear" sera interprété comme un pollutionId
  
  // DELETE /api/favorites/clear - Supprimer tous les favoris
  router.delete("/clear", authenticateToken, favorites.clearFavorites);

  // DELETE /api/favorites/:pollutionId - Retirer un favori
  router.delete("/:pollutionId", authenticateToken, favorites.removeFavorite);

  app.use('/api/favorites', router);
};
