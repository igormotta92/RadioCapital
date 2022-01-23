'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, //PK
        autoIncrement: true, //Auto incremento
        allowNull: false // não pode ser nulo
      },
      login: {
        type: Sequelize.STRING,
        //unique : true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique : true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_image_profile: {
        type: Sequelize.INTEGER,
        references: { model: 'images', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'SET NULL' //CASCADE | SET NULL | RESTRICT
      },
      identif: {
        type: Sequelize.STRING,
        allowNull: false,
        unique : true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      tel: {
        type: Sequelize.STRING,
        allowNull: true
      },
      is_admin: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      active: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      user_activated: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      user_activated_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      password_reset_token: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password_reset_expires: {
        type: Sequelize.DATE,
        allowNull: true
      },
      first_login_at: {
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
    return queryInterface.dropTable('users');
  }
};
