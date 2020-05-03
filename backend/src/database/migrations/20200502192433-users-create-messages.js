module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('messages', { id: Sequelize.INTEGER });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('messages');
  },
};
