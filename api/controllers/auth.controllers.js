const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const db = require("../models");
const Users = db.users;

// Utilisation des variables de configuration pour JWT
const SECRET_KEY = config.JWT_SECRET;
const EXPIRES_IN = config.JWT_EXPIRES_IN;
const REFRESH_SECRET = config.JWT_REFRESH_SECRET;
const REFRESH_EXPIRES_IN = config.JWT_REFRESH_EXPIRES_IN;

// POST : Login (authentification)
exports.login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    // Chercher l'utilisateur par email
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe avec bcrypt
    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer un JWT access token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        role: user.role 
      },
      SECRET_KEY,
      { expiresIn: EXPIRES_IN }
    );

    // Générer un refresh token (optionnel)
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      REFRESH_SECRET,
      { expiresIn: REFRESH_EXPIRES_IN }
    );

    // Configuration selon l'environnement
    const isProduction = process.env.NODE_ENV === 'production';

    // Envoyer les tokens dans des cookies HttpOnly sécurisés
    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: isProduction, // true en production (HTTPS)
      sameSite: isProduction ? 'none' : 'lax', // 'none' en production pour cross-origin
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    // Ajouter le token dans le header Authorization pour l'intercepteur Angular
    res.setHeader('Authorization', `Bearer ${token}`);

    // Retourner les infos utilisateur ET le token dans le body
    res.status(200).json({
      success: true,
      token: token,  // Ajout du token pour l'intercepteur
      refreshToken: refreshToken,  // Optionnel
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
        telephone: user.telephone,
        organisation: user.organisation
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la connexion" });
  }
};

// POST : Register (inscription) avec mot de passe hashé
exports.register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, telephone, organisation, role, adresse } = req.body;

    // Validations essentielles uniquement
    if (!nom || !prenom || !email || !mot_de_passe) {
      return res.status(400).json({ message: "Nom, prénom, email et mot de passe sont requis" });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await Users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Un utilisateur avec cet email existe déjà" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer le nouvel utilisateur
    const newUser = await Users.create({
      nom,
      prenom,
      email,
      mot_de_passe: hashedPassword,
      telephone,
      organisation,
      role: role || 'citoyen',
      adresse,
      date_inscription: new Date(),
      statut_compte: "actif"
    });

    // Générer un token pour connexion automatique
    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email,
        nom: newUser.nom,
        prenom: newUser.prenom,
        role: newUser.role 
      },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Ajouter le token dans le header Authorization pour l'intercepteur Angular
    res.setHeader('Authorization', `Bearer ${token}`);

    res.status(201).json({
      success: true,
      token: token,
      user: {
        id: newUser.id,
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err);
    res.status(500).json({ message: "Erreur serveur lors de l'inscription" });
  }
};

// GET : Vérifier le token (optionnel)
exports.verifyToken = async (req, res) => {
  try {
    // Le token est récupéré depuis le cookie (géré par le middleware)
    // req.user est déjà défini par le middleware authenticateToken
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    const user = await Users.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

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
    console.error('Erreur lors de la déconnexion:', err);
    res.status(500).json({ message: "Erreur serveur lors de la déconnexion" });
  }
};
