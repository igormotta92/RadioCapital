const { Model, DataTypes }  = require('sequelize');

class CategoryAttachment extends Model {

  static get _name() {
    return 'Categoria';
  }

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      category: {
        alias: 'Categoria',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          is: /^[A-Za-z\s]+$/i
        }
      },
    }, {
      sequelize,
      tableName: 'categories_attachment',
      modelName: 'CategoryAttachment',
      defaultScope: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      }
    });
  }

  static associate(models) {
    //hasOne [1:1] - Chave estrangeira definida em B
    this.hasOne(models.Attachment, { foreignKey: 'id_category_attachment', as: 'category_attachment' });
  }

}

module.exports = CategoryAttachment;
