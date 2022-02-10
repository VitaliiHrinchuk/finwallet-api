'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID
      },
      currency: {
        allowNull: false,
        type: Sequelize.STRING(3)
      },
      amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      account_currency_amount: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      transaction_type: {
        allowNull: false,
        type: Sequelize.STRING(3)
      },
      category_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'categories'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      account_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'accounts'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      transaction_date: {
        allowNull: true,
        type: Sequelize.DATE
      },
      note: {
        allowNull: true,
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('transactions');
  }
};
