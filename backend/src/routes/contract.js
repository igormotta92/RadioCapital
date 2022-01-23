const express = require('express');
const routes = express.Router();

const authAdmin = require('@/src/middleware/authAdmin');
const { valid, validCreate } = require('@/src/middleware/routers/contract');

const ContractController = require('@/src/controllers/ContractController');

routes.get('/', authAdmin, ContractController.index);
routes.get('/:id', valid, ContractController.get);

routes.post('/', validCreate, ContractController.create);
routes.put('/:id', authAdmin, ContractController.update);
routes.delete('/:id', authAdmin, ContractController.delete);

/** Contracts Pay Month */

routes.get('/:id/contractspaymonth', valid, ContractController.getPayMonth);
routes.post(
  '/:id/contractspaymonth',
  authAdmin,
  ContractController.createPayMonth
);

module.exports = routes;
