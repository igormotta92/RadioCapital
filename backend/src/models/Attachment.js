const { Model, DataTypes }  = require('sequelize');

class Attachment extends Model {

  static get _name() {
    return 'Anexo';
  }

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      comment: {
        alias: 'Comentário',
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      sequelize
    });
  }

  static associate(models) {

    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });

    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.User, { foreignKey: 'id_user_valid', as: 'user_valid' });

    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.Image, {foreignKey: 'id_image', as: 'image'});

    //belongsTo [1:1] - Chave estrageira definida em A
    this.belongsTo(models.CategoryAttachment, {foreignKey: 'id_category_attachment', as: 'category_attachment'});

  }

}

module.exports = Attachment;
