const express = require('express');
const routes = express.Router();

const authAdmin = require('@/src/middleware/authAdmin');

const ContractPayCompetenceController = require('@/src/controllers/ContractPayCompetenceController');

routes.use(authAdmin);

routes.get('/', ContractPayCompetenceController.index);
routes.get('/:id', ContractPayCompetenceController.get);

routes.put('/:id', ContractPayCompetenceController.update);
routes.delete('/:id', ContractPayCompetenceController.delete);

module.exports = routes;
