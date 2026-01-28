const { v4: uuidv4 } = require ("uuid");


const db = require("../models");
const Users = db.users;
const Op = db.Sequelize.Op;

// GET : tous les utilisateurs
exports.getAll = async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.create = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe, telephone, organisation, role, adresse } = req.body;

    const newUser = await Users.create({
      nom,
      prenom,
      email,
      mot_de_passe, // 🔒 hache le mot de passe dans une vraie app
      telephone,
      organisation,
      role,
      adresse,
      date_inscription: new Date(), 
      statut_compte: "actif" 
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
