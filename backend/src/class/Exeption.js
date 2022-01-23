const SequelizeExeption = require('./SequelizeExeption');
const logger = require('@/src/modules/log/logger');

class Exception {

  constructor(message, campo, codigo) {
    this.name = 'Exception';
    this.message = message || 'Erro Desconhecido';
    this.campo = campo || null;
    this.codigo = codigo || null;
    this.stack = (new Error()).stack;
  }

  static _(e) {

    this._errorJson = JSON.parse(JSON.stringify(e));
    this._error = e;

    let err;

    switch (true) {
      case (SequelizeExeption.isSequelizeException(this._error)):
        err =  SequelizeExeption.SequelizeExeption(this._error);

        let aux = [];
        err.map((obj) => {if (obj.message) aux.push(obj.message);});
        err.message = aux.join(', ');
        err.typeData = 'Array';

        break;
      case (this._isError(this._error)):
        err = {
          type: this._error.name,
          message: this._error.message,
          "id": null,
        };
        break;
      default:
        err =  {
          type: this._error.name,
          message: this._error.message,
          "id": this._error.campo,
        };
        break;
    }

    logger.error(err.message, this._error);

    return err;
  }

  static _isError(err) {
    return (err.name == 'Error');
  }

}

module.exports = Exception;
