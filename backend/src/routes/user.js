const express = require('express');
const routes = express.Router();

const authAdmin = require('@/src/middleware/authAdmin');
const { valid } = require('@/src/middleware/routers/user');

const UserController = require('@/src/controllers/UserController');

routes.get('/', authAdmin, UserController.index);

routes.get('/:id', authAdmin, UserController.get);
routes.get('/:id/messages', valid, UserController.getMessages);

routes.get('/password_reset_token/:token', authAdmin, UserController.getTokenResetPassword);

routes.post('/:id/toggle_active', authAdmin, UserController.toggleActive);
routes.post('/:id/toggle_activated_user', authAdmin, UserController.toggleActivatedUser);

routes.put('/:id/alter_password', valid, UserController.alterPassword);

module.exports = routes;
