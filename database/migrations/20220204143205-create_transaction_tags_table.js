'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transaction_tags', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID
      },
      transaction_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'transactions'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
      },
      tag_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: {
            tableName: 'tags'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade',
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
    await queryInterface.dropTable('transaction_tags');
  }
};
