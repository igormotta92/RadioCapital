const express = require('express');
const routes = express.Router();

const authMiddleware = require('@/src/middleware/auth');

const testeRoutes = require('./teste');

const loginRoutes = require('./login');
const userRoutes = require('./user');
const investorRoutes = require('./investor');
const consultantRoutes = require('./consultant');
const contractRoutes = require('./contract');
const contractpaycompetenceRoutes = require('./contractpaycompetence');
const messageboxRoutes = require('./messagebox');
const attachmentRoutes = require('./attachment');
const adminRoutes = require('./admin');

/** ==========================================================*/
/** Rotas */
routes.get('/', async (req, res) => res.json({
  sucess: true,
  message: "Hello Word",
  data: null
 }));
routes.use('/teste', testeRoutes);

/** Aplicação */
routes.use('/login', loginRoutes);

routes.use(authMiddleware);
routes.use('/users', userRoutes);
routes.use('/investors', investorRoutes);
routes.use('/consultants', consultantRoutes);
routes.use('/contracts', contractRoutes);
routes.use('/contractpaycompetences', contractpaycompetenceRoutes);
routes.use('/messagesbox', messageboxRoutes);
routes.use('/attachments', attachmentRoutes);
routes.use('/admin', adminRoutes);

module.exports = routes;
