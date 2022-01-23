const { Model, DataTypes }  = require('sequelize');

class MessageBox extends Model {

  static get _name() {
    return 'Mensagem';
  }

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      messagem: {
        alias: 'Mensagem',
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      to_group_user: {
        alias: 'Grupo de envio',
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
    }, {
      sequelize,
      tableName: 'messages_box',
      modelName: 'MessageBox',
      defaultScope: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      }
    });
  }

  static associate(models) {
    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.User, {
      foreignKey: 'id_user_send', as: 'user_send'
    });

    //belongsToMany [N:N]
    this.belongsToMany(models.User, {
      //through: 'message_user_view',
      through: 'MessageUserView',
      foreignKey: 'id_message_box',
      as: 'users',
    });

  }

}

module.exports = MessageBox;
