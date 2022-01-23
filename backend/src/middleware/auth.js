const jwt = require('jsonwebtoken');
//const authConfig = require('@/src/config/auth');

const Util = require('@/src/class/Util');
const Exception = require('@/src/class/Exeption');

const CryptoJS = require('crypto-js');

module.exports = (req, res, next) => {
  try {
    /**
     * Antes de fazer verificação pesada, tentar validar o máximo verificação
     * simples
     */

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Exception('Nenhum token foi fornecido');
    }

    //Format Token
    // Bearer 51fs651df5s61dfs65d1fs56d1f56s1f5s6df
    const parts = authHeader.split(' ');

    if (!parts.length === 2) {
      throw new Exception('Token Error');
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      throw new Exception('Token mal formatado');
    }

    //jwt.verify(token, authConfig.secret, (err, decoded) => {
    jwt.verify(token, process.env.SECRET_KEY_JWT, (err, decoded) => {
      if (err) throw new Exception('Token inválido');

      //==============
      //verifica agente
      const lockkey = JSON.parse(CryptoJS.decrypt(decoded.lockkey));
      const { browser, version } = req.useragent;

      //console.log(req.useragent);
      // console.log(
      //   lockkey,
      //   { browser, version: version.match(/(\d*)\./)[1], ip: req.ip, id_user: decoded.user.id_user }
      // );

      if (
        lockkey.browser != browser ||
        lockkey.version != version.match(/(\d*)\./)[1] ||
        lockkey.remote_andress != req.ip ||
        lockkey.id_user != decoded.user.id_user
      ) {
        console.log('Token inválido (lockkey)');
        //Removendo bloquei de mudança de token do user agente
        // throw new Exception("Token inválido");
      }

      req.user = decoded.user;
      return next();
    });
  } catch (e) {
    const result = Exception._(e);
    return res.status(401).json(Util.response(result));
  }
};
