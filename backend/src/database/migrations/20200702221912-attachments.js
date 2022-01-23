'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('attachments', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true, //PK
        autoIncrement: true, //Auto incremento
        allowNull: false // não pode ser nulo
      },
      id_image: {
        type: Sequelize.INTEGER,
        references: { model: 'images', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'RESTRICT' //CASCADE | SET NULL | RESTRICT
      },
      id_category_attachment: {
        type: Sequelize.INTEGER,
        references: { model: 'categories_attachment', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'SET NULL' //CASCADE | SET NULL | RESTRICT
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'CASCADE' //CASCADE | SET NULL | RESTRICT
      },
      id_user_valid: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE', //atualiza o id do usuário caso ele mude
        onDelete: 'SET NULL' //CASCADE | SET NULL | RESTRICT
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    return queryInterface.dropTable('attachments');
  }
};

