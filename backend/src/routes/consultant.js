const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('@/src/config/multer');

const authAdmin = require('@/src/middleware/authAdmin');
const { valid } = require('@/src/middleware/routers/consultant');

const ConsultantController = require('@/src/controllers/ConsultantController');
const ConsultantYeldController = require('@/src/controllers/ConsultantYeldController');

routes.get('/', authAdmin, ConsultantController.index);
routes.get('/:id', valid, ConsultantController.get);
routes.get('/:id/investors', valid, ConsultantController.getInvestors);

routes.get('/:id/yield/:year', valid, ConsultantYeldController.getYield);
routes.get('/:id/yield/:year/month-detail/:month', valid, ConsultantYeldController.getYieldMonthDetail);

routes.post('/', authAdmin, multer(multerConfig).single("profile"), ConsultantController.create);
routes.put('/:id', valid, multer(multerConfig).single("profile"), ConsultantController.update);
routes.delete('/:id', authAdmin, ConsultantController.delete);

module.exports = routes;
