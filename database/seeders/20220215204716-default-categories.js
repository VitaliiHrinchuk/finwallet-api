const { CRE, DEB } = require("./data/categories");
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const categories = [];

    const strToSnakeCase = function(str) {
      return str.split(' ').map(str=> str.toLowerCase()).join('_');
    }

    DEB.forEach((name) => {
      categories.push({
        name: name,
        slug: strToSnakeCase(name),
        created_by: null,
        category_type: "DEB",
        id: uuidv4(),
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      })
    });

    CRE.forEach((name) => {
      categories.push({
        name: name,
        slug: strToSnakeCase(name),
        created_by: null,
        category_type: "CRE",
        id: uuidv4(),
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      })
    });

    await queryInterface.bulkInsert("categories", categories, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
