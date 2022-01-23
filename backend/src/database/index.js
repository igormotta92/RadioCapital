"use strict"; // typical JS thing to enforce strict syntax

const fs = require("fs"); // file system for grabbing files
const path = require("path"); // better than '\/..\/' for portability
const Sequelize = require("sequelize"); // Sequelize is a constructor
const basename = path.basename(__filename);
const dirmodels = path.resolve(__dirname, '../models');
const config = require('@/src/config/database.js');

const logger = require('@/src/modules/log/logger');

const dbs = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config
);

sequelize.authenticate().then(() => {
  logger.info('DB connection sucessful.');
  },
  (err) => {
    logger.error(err.message, err.original);
  });

fs
  .readdirSync(dirmodels)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    let model = require(path.join(dirmodels, file));
    dbs[model.name] = model.init(sequelize);
  });

Object.keys(dbs).forEach(modelName => {
  if (dbs[modelName].associate) {
    dbs[modelName].associate(sequelize.models);
  }
});

/**
 * 20.05.2020 - Não entendi muito bem o pra q disso ainda!!
 * dbs.Sequelize = Sequelize;
 * dbs.sequelize = sequelize;
 * module.exports = dbs;
 */

dbs.Sequelize = Sequelize;
dbs.sequelize = sequelize;
module.exports = dbs;

//module.exports = sequelize;
