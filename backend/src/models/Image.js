const { Model, DataTypes } = require('sequelize');

class Image extends Model {

  static get _name() {
    return 'Imagem';
  }

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      name: {
        alias: 'Nome',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      size: {
        alias: 'Tamanho',
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      key: {
        alias: 'Chave',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      mime: {
        alias: 'Tipo',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      url: {
        alias: 'Url',
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
    }, {
      hooks: {
        beforeValidate: (self, options) => {
          //self.url = `${process.env.BASE_URL}/files/${self.key}`;
        },
      },
      sequelize,
      defaultScope: {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      },
    });
  }

  static associate(models) {
    //hasOne [1:1] - Chave estrangeira definida em B
    this.hasOne(models.User, { foreignKey: 'id_image_profile', as: 'profile' });

  }

  static file2Image(file, id_user) {
    const { originalname: name, size, filename: key, mimetype: mime, } = file;
    const url = `${global.__MYURL}/files/${id_user}/${key}`;
    return { name, size, key, mime, url };
  }

}

module.exports = Image;
