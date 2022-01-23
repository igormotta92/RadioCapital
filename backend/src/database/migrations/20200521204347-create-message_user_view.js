'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('message_user_view', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, //PK
        autoIncrement: true, //Auto incremento
        allowNull: false // não pode ser nulo
      },
      id_message_box: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'messages_box', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'CASCADE' //CASCADE | SET NULL | RESTRICT
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'CASCADE' //CASCADE | SET NULL | RESTRICT
      },
      viewed: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      time_view: {
        type: Sequelize.DATE,
        //allowNull: false,
        //defaultValue: Sequelize.fn('now'),
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
    return queryInterface.dropTable('message_user_view');
  }
};
