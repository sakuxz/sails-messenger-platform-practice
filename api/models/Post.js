module.exports = {
  attributes: {
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    img: {
      type: Sequelize.STRING(20),
      allowNull: true
    },
  },
  associations: function() {
    Post.belongsTo(User, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false
      }
    });
  },
};
