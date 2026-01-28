module.exports = (sequelize, Sequelize) => {
  const Pollution = sequelize.define("pollution", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    titre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lieu: {
      type: Sequelize.STRING
    },
    date_observation: {
      type: Sequelize.DATE
    },
    type_pollution: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.TEXT
    },
    latitude: {
      // stocke les coordonnées GPS avec 6 décimales
      type: Sequelize.DECIMAL(9,6)
    },
    longitude: {
      type: Sequelize.DECIMAL(9,6)
    },
    photo_url: {
      type: Sequelize.STRING
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users", // nom de la table
        key: "id"
      },
      onDelete: "CASCADE"
    }
  }, {
    tableName: 'pollution',
    timestamps: false
  });
  

  return Pollution;
}; 
