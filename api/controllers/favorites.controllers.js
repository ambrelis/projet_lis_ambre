const db = require("../models");
const Favorite = db.favorites;
const Pollution = db.pollution;

// GET : Récupérer les favoris de l'utilisateur connecté
exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    // ...log supprimé...

    const favorites = await Favorite.findAll({
      where: { user_id: userId },
      include: [{
        model: Pollution,
        as: 'pollution'
      }],
      order: [['added_at', 'DESC']]
    });

    // ...log supprimé...
    // ...log supprimé...
    res.status(200).json(favorites);
  } catch (err) {
    // ...log supprimé...
    res.status(500).json({ message: err.message });
  }
};

// POST : Ajouter un favori
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pollution_id } = req.body;
    // ...log supprimé...

    if (!pollution_id) {
      return res.status(400).json({ message: "pollution_id requis" });
    }

    // Vérifier si déjà en favori
    const existing = await Favorite.findOne({
      where: {
        user_id: userId,
        pollution_id: pollution_id
      }
    });

    if (existing) {
      // ...log supprimé...
      return res.status(409).json({ message: "Déjà dans les favoris" });
    }

    // Créer le favori
    const favorite = await Favorite.create({
      user_id: userId,
      pollution_id: pollution_id,
      added_at: new Date()
    });

    // ...log supprimé...
    res.status(201).json(favorite);
  } catch (err) {
    // ...log supprimé...
    res.status(500).json({ message: err.message });
  }
};

// DELETE : Retirer un favori
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const pollutionId = req.params.pollutionId;

    const deleted = await Favorite.destroy({
      where: {
        user_id: userId,
        pollution_id: pollutionId
      }
    });

    if (deleted === 0) {
      return res.status(404).json({ message: "Favori non trouvé" });
    }

    res.status(200).json({ message: "Favori supprimé" });
  } catch (err) {
    // ...log supprimé...
    res.status(500).json({ message: err.message });
  }
};

// DELETE : Supprimer tous les favoris de l'utilisateur
exports.clearFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    await Favorite.destroy({
      where: { user_id: userId }
    });

    res.status(200).json({ message: "Tous les favoris ont été supprimés" });
  } catch (err) {
    // ...log supprimé...
    res.status(500).json({ message: err.message });
  }
};
