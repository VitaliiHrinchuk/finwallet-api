'use strict';

const tagNames = require('./data/tags');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {

    const strToSnakeCase = function(str) {
      return str.split(' ').map(str=> str.toLowerCase()).join('_');
    }

    const tags = tagNames.map(name => {
      return {
        name: name,
        slug: strToSnakeCase(name),
        created_by: null,
        id: uuidv4(),
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })

    await queryInterface.bulkInsert("tags", tags, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tags', null, {});
  }
};
