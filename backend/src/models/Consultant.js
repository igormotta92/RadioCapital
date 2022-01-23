const { Model, DataTypes }  = require('sequelize');

class Consultant extends Model {

  static get _name() {
    return 'Consultor';
  }

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      //id_user: DataTypes.INTEGER //Até funciona
    }, {
      sequelize,
      timestamps: false
      //tableName: 'Consultants',
      //modelName: Consultant
    });
  }

  /**
   * Table A e Table B
   * belongsTo [1:1] - Chave estrageira definida em A
   * hasOne [1:1] - Chave estrangeira definida em B
   * hasMany [1:N] - Chave estrangeira definida em B
   */

  static associate(models) {
    //Consultant [1 : 1] User
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' }); //tem um usuário
    //Consultant [1 : N] Investor
    this.hasMany(models.Investor, { foreignKey: 'id_consultant', as: 'investors' });
  }

}

module.exports = Consultant;
