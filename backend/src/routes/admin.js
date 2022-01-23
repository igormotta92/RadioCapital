const express = require('express');
const routes = express.Router();

const authAdmin = require('@/src/middleware/authAdmin');

const AdminController = require('@/src/controllers/AdminController');

routes.use(authAdmin);

routes.get('/pending/investors', AdminController.pendingInvestor);
routes.get('/pending/consultants', AdminController.pendingConsultants);
routes.get('/pending/contracts', AdminController.pendingContracts);

module.exports = routes;
