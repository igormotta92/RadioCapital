const express = require('express');
const routes = express.Router();

const authAdmin = require('@/src/middleware/authAdmin');
const { valid } = require('@/src/middleware/routers/messagebox');

const MessageBoxController = require('@/src/controllers/MessageBoxController');

routes.get('/', authAdmin, MessageBoxController.index);
routes.get('/:id', valid, MessageBoxController.get);

routes.post('/', authAdmin, MessageBoxController.create);
routes.post('/:id_user', authAdmin, MessageBoxController.toUser);

routes.post('/:id/viewd', valid, MessageBoxController.setViewed);

module.exports = routes;
