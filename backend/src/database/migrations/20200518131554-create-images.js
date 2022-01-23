'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('images', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, //PK
        autoIncrement: true, //Auto incremento
        allowNull: false // não pode ser nulo
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false
      },
      mime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      url: {
        type: Sequelize.TEXT,
        allowNull: false,
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
    return queryInterface.dropTable('images');
  }
};

