import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { studentRoute } from '../modules/student/student.route';
import { academicSemisterRoute } from '../modules/academicSemister/academicSemister.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/students',
    route: studentRoute,
  },
  {
    path: '/academic-semisters',
    route: academicSemisterRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
