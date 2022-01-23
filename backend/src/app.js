//https://medium.com/@justintulk/solve-module-import-aliasing-for-webpack-jest-and-vscode-74007ce4adc9
//https://arunmichaeldsouza.com/blog/aliasing-module-paths-in-node-js
//https://www.npmjs.com/package/module-alias
require('module-alias/register')
require('moment/locale/pt-br');

/** Prototype */
require('@/src/prototype/ModelSequelize');
require('@/src/prototype/String');
require('@/src/prototype/CryptoJS');

/** Banco de Dados */
require('@/src/database');

/** ==========================================================*/
/** Server */
const express = require('express');
const cors = require('cors');
const path = require('path');
const useragent = require('express-useragent');

const routes = require('@/src/routes');
const { mkDir } = require('@/src/utils/file');

const Util = require('@/src/class/Util');
const logger = require('@/src/modules/log/logger');

//--
/** Root path of app */
//process.env['__ROOT'] = process.cwd();
//console.log(process.env.__ROOT);

/** ==========================================================*/
/** Custom */
const inteceptedResponse = require('@/src/middleware/inteceptedResponse');

/** ==========================================================*/
/** App */
const app = express();

/** ==========================================================*/
/** Middlewares */
/** ==========================================================*/
app.use(useragent.express()); /** User Agente */
app.use(cors()); /** Segurança de Api */
app.use(express.json()); /*Informar que a requisição a ser usada será de json*/

/** ==========================================================*/
//Extra
app.use(inteceptedResponse);

/** ==========================================================*/
//Log Request Morgan
//app.use(require('@/src/modules/log/morgan.js'));

/** ==========================================================*/
//Statics
//https://www.youtube.com/watch?v=MkkbUfcZUZM - Upload de arquivos: back-end com NodeJS | Diego Fernandes
//app.use('/files', express.static(path.resolve(__dirname, '../tmp/uploads')));
app.use('/files', express.static(path.resolve('./attachments')));

/** ==========================================================*/
/** Init Globals Variables  */
app.use((req, res, next) => {
  global.__ROOT = process.cwd();
  global.__MYURL = `${req.protocol}://${req.get("host")}`;
  next();
});

/** ==========================================================*/
/** Disponibilizar req for Log  */
app.use((req, res, next) => {
  const logger = require('@/src/modules/log/logger');
  logger.req = req;
  next();
});

/** ==========================================================*/
/** Rotas */
app.use(routes);

/** ==========================================================*/
//http://expressjs.com/en/guide/error-handling.html
//https://dev.to/nedsoft/central-error-handling-in-express-3aej
app.use((err, req, res, next) => {
  //console.log(err.statusCode);
  logger.error(err.message, err);
  res.status(404).json(Util.response(err, err.message));
  next()
})

mkDir('tmp/uploads');

module.exports = app;


