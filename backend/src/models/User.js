const { Model, DataTypes }  = require('sequelize');
const bcrypt = require('bcrypt');
const Crypto = require("crypto");
const cpf = require("@fnando/cpf/commonjs");

//https://medium.com/@thihenos/node-salvando-imagens-em-banco-de-dados-e-convertendo-em-imagens-novamente-1a304880f285

class User extends Model {

  static get _name() {
    return 'Usuário';
  }

  static init(sequelize) { //recebe a conexão do banco de dados
    return super.init({
      login: {
        alias: 'Login',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[a-z]+$/i
        }
      },
      //Vê validador de senha
      email: {
        alias: 'E-mail',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        }
      },
      password: {
        alias: 'Senha',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      // id_image_profile: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false
      // },
      identif: {
        alias: 'CPF',
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          is: /^[0-9]+$/i,
          isCustom(value) {
            //console.log('XXXXX', this.toJSON());
            if (!cpf.isValid(value)) {
              throw new Error('inválido!');
            }
          }
        }
      },
      name: {
        alias: 'Nome',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          is: /^[A-Za-z\s]+$/i
        }
      },
      last_name: {
        alias: 'Sobrenome',
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          is: /^[A-Za-z\s]+$/i
        }
      },
      fullname: { //final
        alias: 'Nome completo',
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.name} ${this.last_name}`;
        }
      },
      tel: {
        alias: 'Telefone',
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9]*$/i //https://medium.com/@igorrozani/criando-uma-express%C3%A3o-regular-para-telefone-fef7a8f98828
        }
      },
      is_admin: DataTypes.INTEGER,
      active: DataTypes.INTEGER,
      user_activated: DataTypes.INTEGER,
      user_activated_at: DataTypes.DATE,
      password_reset_token: DataTypes.STRING,
      password_reset_expires: DataTypes.DATE,
      first_login_at: DataTypes.DATE,
    }, {
      hooks: {
        beforeValidate: (self, options) => {
          // if (!self.password && !self.first_login_at) {
          //   //Criação User
          //   self.password = Crypto.randomBytes(5).toString('hex');
          // }

        },
        beforeCreate: (self, options) => {
          //self.password = Crypto.randomBytes(5).toString('hex');
          //self.password = this.generateHash(self.password);
        },
        beforeUpdate: (self, options) => {
          //quando senha não é passada no body

          /** 05-07-2020
           * Quando for cadastrar tem q gerar a senha
           * Quando fizer o primeiro login tem por o hash na senha
           * Atualizar a senha tem uma rota propria
           */

          // if (!options.update_password) return;

          // if (!self.previous('first_login_at') && !options.notHash) {

          //   //primeiro login, tem q criptografar a senha
          //   //notHash é usado na UserController:toggleActivatedUser()
          //   self.password = this.generateHash(self.password);
          // } else {

          //   if (self.password === self.previous('password')) return;

          //   if (!bcrypt.compareSync(self.password, self.previous('password'))) {
          //     self.password = this.generateHash(self.password);
          //   }
          // }

        },
      },
      sequelize,
      defaultScope: {
        attributes: {
          exclude: [
            'createdAt',
            'updatedAt',
            'password',
            'password_reset_token',
            'password_reset_expires'
          ]
        },
      },
    });
  }

  static associate(models) {
    //hasOne [1:1] - Chave estrangeira definida em B
    this.hasOne(models.Consultant, { foreignKey: 'id_user', as: 'consultant' });
    this.hasOne(models.Investor, { foreignKey: 'id_user', as: 'investor' });

    this.belongsTo(models.Image, { foreignKey: 'id_image_profile', as: 'profile' });

    //belongsToMany [N:N]
    this.belongsToMany(models.MessageBox, {
      //through: 'message_user_view',
      through: 'MessageUserView',
      foreignKey: 'id_user',
      as: 'messages_box'
    });

  }

  //https://www.abeautifulsite.net/hashing-passwords-with-nodejs-and-bcrypt **
  //https://medium.com/@mridu.sh92/a-quick-guide-for-authentication-using-bcrypt-on-express-nodejs-1d8791bb418f
  //https://auth0.com/blog/hashing-in-action-understanding-bcrypt/


  //valid senha
  static isPassowordValid(password) {
    return password.test(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/);
  }

  //generating a hash
  static generateHash(password) {
    //eestá dando erro!!
    // if (!User.isPassowordValid(camposUser.password)) {
    //   throw new Exception(`
    //     Senha inválida, senha deve ter
    //     minimo de 8 caracteres,
    //     1 número,
    //     1 caracter especial,
    //     1 letras maiúsculas,
    //     1 letras minúsculas
    //   `);
    // }
    return bcrypt.hashSync(password.toString(), bcrypt.genSaltSync(10));
  }

}

//Prototype (Disponível no retorno de uma instâcia)
User.prototype.validPassword = function(password) {
  if (!this.first_login_at) {
    //primeiro login
    return (password === this.password)
  } else {
    return bcrypt.compareSync(password, this.password);
  }
}

module.exports = User;
