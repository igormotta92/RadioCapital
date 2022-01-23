/** Não sendo usada (Excluir não for realmente usar) */

const { Model }  = require('sequelize');

class SequelizeModel extends Model {

  /**
   * Retorna um padrão <nome_campo>:<mensagem_errro>
   * @param {Objeto de Erro} error
   */

  static prettyError(error) {

    //console.log(error);
    //console.log(JSON.parse(JSON.stringify(error)));

    const aux = [];

    if (error.errors) {

        /** Erros de validação */

        const fields = [];

        [...error.errors].forEach(error => {

          if (fields.indexOf(error.path) < 0) {
            fields.push(error.path);

            let { field, message } = this.msgErrorValidate(error);

            aux.push({
              type: "Validação",
              message,
              "id": field
            });
          };

        });

    } else {

      /** Outros Erros */

      switch (error.name) {
        case 'SequelizeForeignKeyConstraintError':

          const [ field ] = error.fields;

          aux.push({
            message: `${this.idToText(field)} não existe`,
            "id": field
          });

          break;

        default:
          aux.push({
            message: error.message,
            "id": null
          });
          break;
      };


    }


    return aux;
  }

  static msgErrorValidate(err) {
    let message;

    switch (err.validatorKey) {
      case 'notEmpty':
        message = this.getMsgObrigatory;
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
        message = `${this.getMsgObrigatory} (nulo POST)`;
        break;

      default:
        message = err.message;
      break;
    }

    let field = err.path.split('.')[1];
    if (!field) field = err.path;

    message = `${field.capitalize()} ${message}`;

    return { field, message };
  }

  static idToText(valor) {

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

  static get getMsgObrigatory() {
    return "não pode ser vazio";
  }

}

module.exports = SequelizeModel;
