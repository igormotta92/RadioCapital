
/**
 * Retonar uma mensagem de erro do objeto seguindo uma ordem de prioridade
 * @param {*} error Objeto de Error
 */

const getMessage = (error) => {
  let msg;

  switch (true) {
    case Boolean(error.response):
      msg = error.response.data.message;
      break;

    default:
      msg = error.message;
      break;
  }

  return msg;
}

module.exports = {
  getMessage
}
