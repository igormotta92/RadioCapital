class SequelizeExeption {
  /** Sequelize */

  static isSequelizeException(error) {
    if (error.name.match(/^Sequelize/)) return true
    else return false;
  }

  static SequelizeExeption(error) {
    //backend\node_modules\sequelize\lib\errors\validation-error.js

    this._errorJson = JSON.parse(JSON.stringify(error));
    this._error = error;

    const aux = [];

    if (this._error.errors) {
      /** Erros de validação */
      return this._SequelizeValidate();

    } else {

      /** Outros Erros */

      switch (this._error.name) {
        case 'SequelizeForeignKeyConstraintError':
          const [ field ] = this._error.fields;

          aux.push({
            type: this._error.name,
            message: `${this.idTable2Text(field)} não existe`,
            "id": field,
          });
          break;

        default:
          aux.push({
            type: "other",
            message: this._error.message,
            "id": null,
          });
          break;
      };

      return aux;
    }

  }

  static _SequelizeValidate() {

    const aux = [];
    const fields = [];

    [...this._error.errors].forEach(err => {

      if (fields.indexOf(err.path) < 0) {
        fields.push(err.path);

        let { field, message } = this._SequelizeValidateMessage(err);

        aux.push({
          type: "validate",
          message,
          "id": field,
        });
      };

    });

    return aux;
  }

  static _SequelizeValidateMessage(err) {
    let message;

    switch (err.validatorKey) {
      case 'notEmpty':
        //message = this.getMsgObrigatory;
        message = "não pode ser vazio";
        break;

      case 'is':
        message = 'inválido';
        break;

      case 'isEmail':
        message = 'inválido';
        break;

      case 'not_unique':
        message = "já existe";
        break;

      case 'is_null':
        message = `não pode ser vazio (nulo POST)`;
        break;

      default:
        message = err.message;
      break;
    }

    let afield = err.path.split('.');
    let field = (afield.length > 1) ? afield[1] : afield[0];

    if (err.instance.rawAttributes[field].alias) {
      field = err.instance.rawAttributes[field].alias;
    }

    message = `${field.capitalize()} ${message}`;

    return { field, message };
  }

  static idTable2Text(valor) {

    switch (valor) {
      case 'id_user':
        return 'Usuário';

      case 'id_investor':
        return 'Investidor';

      case 'id_consultant':
        return 'Consultor';

      case 'id_administrator':
        return 'Administrador';

      default:
        return valor;
        break;
    }

  }

  /** Mensagens de Erro */

  // static get getMsgObrigatory() {
  //   return "não pode ser vazio";
  // }

}

module.exports = SequelizeExeption;
