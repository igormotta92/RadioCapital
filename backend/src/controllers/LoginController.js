const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const Crypto = require("crypto");
const moment = require("moment");
const mailer = require("@/src/modules/mailer");
//const authConfig = require('@/src/config/auth');

const UserModel = require('@/src/models/User');
const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

//https://www.youtube.com/watch?v=aVAl8GzS0d0

module.exports = {
  async login(req, res) {
    try {
      /**
       * Por algum motivo as associações do findOne vem como String
       * talvez seja por causa da associção hasOne
       */

      const { email, password } = req.body;
      let user = await UserModel.findOne({
        include: [
          { association: 'investor' },
          { association: 'consultant' },
          { association: 'profile' },
        ],
        attributes: {
          include: ['password'],
        },
        where: {
          email,
        },
      });

      const msgError = "Usuário ou senha incorretos"

      if (!user) throw new Exception(`${msgError} (1)`);

      if (!user.validPassword(password)) {
        throw new Exception(`${msgError} (2)`);
      }

      if (!user.active || !user.user_activated) throw new Exception(`${msgError} (3)`);

      if (!user.first_login_at) {
        user.update({
          password: UserModel.generateHash(password),
          first_login_at: moment().format()
        });
      }

      //console.log(user.toJSON());
      //console.log( JSON.stringify(user.investor, null, 2) );
      //console.log( JSON.stringify(user.consultant, null, 2) );

      let id;
      let type;

      switch (true) {
        case user.investor != null:
          id = user.investor.id;
          type = 'investor';
          break;
        case user.consultant != null:
          id = user.consultant.id;
          type = 'consultant';
          break;
      }

      const result = {
        id,
        type,
        id_user: user.id,
        login: user.login,
        email: user.email,
        name: user.name,
        is_admin: user.is_admin,
        profile_url: user.profile ? user.profile.url : null,
      };

      //console.log(result);

      const { browser, version } = req.useragent;

      let lockkey = {
        id_user: user.id,
        remote_andress: req.ip, //https://stackoverflow.com/questions/19266329/node-js-get-clients-i
        browser,
        version: version.match(/(\d*)\./)[1],
      };
      lockkey = CryptoJS.enencrypt(JSON.stringify(lockkey));

      //==========
      //JWT Token
      //https://www.youtube.com/watch?v=KKTX1l3sZGk
      //https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout

      //const token = jwt.sign({ user: result, lockkey  }, authConfig.secret, {
      const token = jwt.sign(
        { user: result, lockkey },
        process.env.SECRET_KEY_JWT,
        {
          expiresIn: 86400, //1 dia
        }
      );
      //==========

      return res.json(Util.response({ token }, 'Logado com Sucesso'));
    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }
  },

  async forgot_password(req, res) {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ where: { email }});
      if (!user) {
        throw new Exception("Email não cadastrado");
      }

      const token = Crypto.randomBytes(20).toString('hex');
      const now = moment().add(30, 'minute').format();

      user.update({
        password_reset_token: token,
        password_reset_expires: now
      });

      mailer.sendMail({
        to: email,
        template: 'login/forgot_password',
        context: { token },
      }, (err) => {
        if (err)
          throw new Exception(`Erro ao enviar o email de recuperação de senha. ${err.message}`);
      });

      return res.json(Util.response({}, 'Email enviado com sucesso'));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result, 'Erro ao recuperar a senha, tente novamente'));
    }

  },

  async reset_password(req, res) {

    const { email, token, password } = req.body;

    try {

      const user = await UserModel.findOne({
        attributes: {
          include: ['password', 'password_reset_token', 'password_reset_expires']
        },
        where: { email }});
      if (!user) {
        throw new Exception("Usuário não encontrado");
      }

      if (token !== user.password_reset_token) {
        throw new Exception("Token inválido");
      }

      const now = moment().format();
      const reset_expires = moment(user.password_reset_expires).format();

      if (now > reset_expires) {
        throw new Exception("Token expirou, gere um novo");
      }

      //================================
      //alterar aqui!!
      //const password = UserModel.generateHash(password);
      user.update({
        password_reset_token: null,
        password_reset_expires: null,
        //password: hash_password
        password: UserModel.generateHash(password)
      });

      return res.json(Util.response({}, 'Senha alterada com sucesso'));

    } catch (e) {
      const result = Exception._(e);
      return res.status(400).json(Util.response(result));
    }

  }

};
