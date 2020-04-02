import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/CourierController';
import AvatarController from './app/controllers/AvatarController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipient', adminMiddleware, RecipientController.store);
routes.put('/recipient/:id', adminMiddleware, RecipientController.update);

routes.post(
  '/couriers',
  adminMiddleware,
  upload.single('file'),
  CourierController.store
);
routes.put('/couriers/:id', adminMiddleware, CourierController.update);

routes.put(
  '/couriers/avatar/:id',
  upload.single('file'),
  AvatarController.update
);

export default routes;
