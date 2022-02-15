'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      slug: {
        allowNull: false,
        type: Sequelize.STRING(255)
      },
      created_by: {
        allowNull: true,
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
    await queryInterface.dropTable('tags');
  }
};
