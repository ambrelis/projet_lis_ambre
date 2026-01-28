module.exports = (sequelize, Sequelize) => {
  const Favorite = sequelize.define("favorite", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    pollution_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "pollution",
        key: "id"
      },
      onDelete: "CASCADE"
    },
    added_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    }
  }, {
    tableName: 'favorites',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'pollution_id']
      }
    ]
  });

  return Favorite;
};
