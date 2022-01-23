const express = require('express');
const routes = express.Router();

const log = require('@/src/modules/log/logger');

routes.post('/log', (req, res) => {
  log.info(`Retun sucess response`);
  res.json({ result: 'Fim' });
});

module.exports = routes;
