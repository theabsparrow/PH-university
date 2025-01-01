import { Router } from 'express';
import { userController } from '../modules/user/user.controller';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userController.createStudent,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
