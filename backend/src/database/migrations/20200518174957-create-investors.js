'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('investors', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, //PK
        autoIncrement: true, //Auto incremento
        allowNull: false // não pode ser nulo
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'CASCADE' //CASCADE | SET NULL | RESTRICT
      },
      id_consultant: {
        type: Sequelize.INTEGER,
        references: { model: 'consultants', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'SET NULL' //CASCADE | SET NULL | RESTRICT
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('investors');
  }
};
