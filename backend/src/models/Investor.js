const { Model, DataTypes }  = require('sequelize');

class Investor extends Model {

  static get _name() {
    return 'Investidor';
  }

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      //id_user: DataTypes.INTEGER //Até funciona
    }, {
      sequelize,
      timestamps: false,
      //tableName: 'Investors'
    });
  }

  static associate(models) {

    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' }); //tem um usuário

    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.Consultant, {foreignKey: 'id_consultant', as: 'consultant'});

    //hasOne [1:1] - Chave estrangeira definida em B
    this.hasOne(models.Contract, {foreignKey: 'id_investor', as: 'contracts'});

  }

}

module.exports = Investor;
