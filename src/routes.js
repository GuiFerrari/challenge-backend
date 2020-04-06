import { Router } from 'express';
import multer from 'multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import CourierController from './app/controllers/CourierController';
import AvatarController from './app/controllers/AvatarController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/auth';
import adminMiddleware from './app/middlewares/admin';
import multerConfig from './config/multer';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);
routes.use(adminMiddleware);

routes.post('/recipient', RecipientController.store);
routes.put('/recipient/:id', RecipientController.update);

routes.get('/couriers', CourierController.index);
routes.post('/courier', upload.single('file'), CourierController.store);
routes.put('/courier/:id', CourierController.update);
routes.delete('/courier/:id', CourierController.delete);

routes.put(
  '/couriers/avatar/:id',
  upload.single('file'),
  AvatarController.update
);

routes.get('/orders', OrderController.index);
routes.post('/order', OrderController.store);
routes.delete('/order/:id', OrderController.delete);

export default routes;
