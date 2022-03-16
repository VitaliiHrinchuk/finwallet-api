'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users',
      'user_configured',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'user_configured');
  }
};
