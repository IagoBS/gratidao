import { Router } from 'express';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MessageController from './app/controllers/MessageController';
import CategoryController from './app/controllers/CategoryController';
import MessageProviderController from './app/controllers/MessageProviderController';

import authMiddleware from './app/middlewares/auth';
import multerConfiguration from './config/multer';

const routes = new Router();
const upload = multer(multerConfiguration);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.post('/files', upload.single('file'), FileController.store);

routes.post('/messages', MessageController.store);
routes.get('/messages', MessageController.index);

routes.post('/categories', CategoryController.store);

routes.get('/message', MessageProviderController.index);

export default routes;
