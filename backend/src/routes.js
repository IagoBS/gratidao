import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MessageController from './app/controllers/MessageController';
import CategoryController from './app/controllers/CategoryController';
import MessageProviderController from './app/controllers/MessageProviderController';
import ForgotPasswordController from './app/controllers/ForgotPasswordController';
import NotificationController from './app/controllers/NotificationController';
import authMiddleware from './app/middlewares/auth';
import multerConfiguration from './config/multer';

const routes = new Router();
const upload = multer(multerConfiguration);

routes.post('/users', UserController.store);

routes.post('/session', SessionController.store);

routes.post('/forgotpassword', ForgotPasswordController.store);
routes.put('/forgotpassword/:token', ForgotPasswordController.update);

routes.use(authMiddleware);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

routes.post('/messages', MessageController.store);
routes.get('/messages', MessageController.index);
routes.put('/messages/:id', MessageController.update);
routes.delete('/messages/:id', MessageController.delete);

routes.post('/categories', CategoryController.store);
routes.put('/categories/:id', CategoryController.update);
routes.delete('/categories/:id', CategoryController.delete);

routes.get('/message', MessageProviderController.index);

routes.get('/notification', NotificationController.index);
routes.put('/notification/:id', NotificationController.update);

export default routes;
