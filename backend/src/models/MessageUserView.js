const { Model, DataTypes }  = require('sequelize');

class MessageUserView extends Model {

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      viewed: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      time_view: DataTypes.DATE
    }, {
      sequelize,
      tableName: 'message_user_view',
      defaultScope: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      }
    });
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
    this.belongsTo(models.MessageBox, { foreignKey: 'id_message_box', as: 'message' });
  }

}

module.exports = MessageUserView;
