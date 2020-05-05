module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('messages', 'category_id', {
      type: Sequelize.INTEGER,
      references: { model: 'categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn('messages', 'category_id');
  },
};
