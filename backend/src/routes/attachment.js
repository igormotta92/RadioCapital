const express = require('express');
const routes = express.Router();
const multer = require('multer');
const multerConfig = require('@/src/config/multer');

const authAdmin = require('@/src/middleware/authAdmin');
const { validAttach } = require('@/src/middleware/routers/attachment');

const AttachmentController = require('@/src/controllers/AttachmentController');

routes.get('/attachmentsForValid', authAdmin, AttachmentController.attachmentsForValid);

routes.post('/attach', validAttach, multer(multerConfig).single('file'), AttachmentController.attach);
routes.delete('/detach/:id', authAdmin, AttachmentController.detach);

routes.post('/toogleValidAttachment/:id', authAdmin, AttachmentController.toogleValidAttachment);

module.exports = routes;
