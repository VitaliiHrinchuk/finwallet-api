'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('accounts', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING(3)
      },
      hex_color: {
        allowNull: true,
        type: Sequelize.STRING(6)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('accounts');
  }
};
