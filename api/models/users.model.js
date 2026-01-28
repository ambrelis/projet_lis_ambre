module.exports = (sequelize, Sequelize) => {
  const Users = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    prenom: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    mot_de_passe: {
      type: Sequelize.STRING,
      allowNull: false
    },
    telephone: {
      type: Sequelize.STRING
    },
    organisation: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.ENUM('citoyen', 'entreprise', 'admin'),
      defaultValue: 'citoyen'
    },
    adresse: {
      type: Sequelize.STRING
    },
    date_inscription: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    statut_compte: {
      type: Sequelize.ENUM('actif', 'inactif', 'supprimé'),
      defaultValue: 'actif'
    }
  });

  return Users;
};
