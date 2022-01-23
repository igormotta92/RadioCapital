const express = require('express');
const routes = express.Router();

const LoginController = require('@/src/controllers/LoginController');

routes.post('/', LoginController.login);
routes.post('/forgot_password', LoginController.forgot_password);
routes.post('/reset_password', LoginController.reset_password);

module.exports = routes;
