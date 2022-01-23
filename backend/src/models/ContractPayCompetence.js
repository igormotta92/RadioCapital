const { Model, DataTypes }  = require('sequelize');

class ContractPayCompetence extends Model {

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      value: {
        alias: 'Valor',
        type: DataTypes.FLOAT,
        allowNull: false
      },
      competence: {
        alias: 'Competência',
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
          notEmpty: true,
          is: /\d{6}/i
        }
      }
    }, {
      sequelize,
      defaultScope: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      }
    });
  }

  static associate(models) {
    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.Contract, { foreignKey: 'id_contract', as: 'contract' }); //tem um contract
    this.belongsTo(models.User, { foreignKey: 'id_user_pay', as: 'userpay' }); //tem um contract
  }

}

module.exports = ContractPayCompetence;
