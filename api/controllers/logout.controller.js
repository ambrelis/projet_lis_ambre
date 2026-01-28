const config = require('../config');

// POST : Logout (déconnexion)
exports.logout = async (req, res) => {
  try {
    // Supprimer les cookies en les définissant avec une date d'expiration passée
    res.cookie('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0 // Expire immédiatement
    });

    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    res.status(200).json({
      success: true,
      message: 'Déconnexion réussie'
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la déconnexion" });
  }
};
