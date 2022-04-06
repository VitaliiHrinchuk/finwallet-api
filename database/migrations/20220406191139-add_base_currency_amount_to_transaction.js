'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'transactions',
      'base_currency_amount',
      {
        allowNull: false,
        type: Sequelize.DOUBLE
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('transactions', 'base_currency_amount');
  }
};
