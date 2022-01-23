//https://medium.com/@selvaganesh93/how-node-js-middleware-works-d8e02a936113

const logger = require('@/src/modules/log/logger');

/** Interceptando o response */
module.exports = (req, res, next) => {
  let oldSend = res.send

  res.send = async function(body) {

    const data = JSON.parse(body);
    body = JSON.parse(body);

    const sucess = (res.statusCode >= 400) ? false : true;
    //if (sucess) logger.info(data.message, data.data);
    //if (sucess) logger.info(data.message);
    //else logger.error(data.message, data.data);

    //console.log(new Error('TESTE'));

    if (sucess) {
      logger.info(data.message, data);
    }


    const result = {
      sucess,
      ...body
    }
    res.send = oldSend // set function back to avoid the 'double-send'
    return res.send(result) // just call as normal with data
  }
  next();
}

/**
 * Códigos de status de respostas HTTP
 *
 * Respostas de informação (100-199)
 * Respostas de sucesso (200-299)
 * Redirecionamentos (300-399)
 * Erros do cliente (400-499)
 * Erros do servidor (500-599)
 */
