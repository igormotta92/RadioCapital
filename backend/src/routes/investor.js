const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('@/src/config/multer');

const authAdmin = require('@/src/middleware/authAdmin');
const { valid, validCreate } = require('@/src/middleware/routers/investor');

const InvestorController = require('@/src/controllers/InvestorController');

routes.get('/', authAdmin, InvestorController.index);
routes.get('/:id', valid, InvestorController.get);
routes.get('/:id/contracts', valid, InvestorController.contracts);

routes.post(
  '/createInvestorContract',
  validCreate,
  multer(multerConfig).single('profile'),
  InvestorController.createInvestorContract
);


routes.post(
  '/',
  validCreate,
  multer(multerConfig).single('profile'),
  InvestorController.create
);

routes.put(
  '/:id',
  valid,
  multer(multerConfig).single('profile'),
  InvestorController.update
);

routes.delete('/:id', authAdmin, InvestorController.delete);

module.exports = routes;
