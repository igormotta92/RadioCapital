'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categories_attachment', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, //PK
        autoIncrement: true, //Auto incremento
        allowNull: false // não pode ser nulo
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        unique : true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories_attachment');
  }
};

