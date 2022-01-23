'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contracts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, //PK
        autoIncrement: true, //Auto incremento
        allowNull: false // não pode ser nulo
      },
      id_investor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'investors', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'CASCADE' //CASCADE | SET NULL | RESTRICT
      },
      day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      begin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      final: {
        type: Sequelize.DATE,
        allowNull: false
      },
      // break_contract: {
      //   type: Sequelize.DATE,
      //   allowNull: true
      // },
      time: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      charging_rate: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      contract_activated: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      contract_activated_at: {
        type: Sequelize.DATE,
        allowNull: true
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
    return queryInterface.dropTable('contracts');
  }
};
