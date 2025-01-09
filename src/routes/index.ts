import { Router } from 'express';
import { userRoute } from '../modules/user/user.route';
import { studentRoute } from '../modules/student/student.route';
import { academicSemisterRoute } from '../modules/academicSemister/academicSemister.route';
import { academicFacultyRoute } from '../modules/academicFaculty/academicFaculty.route';
import { academicDepartmentRoute } from '../modules/academicDepartment/academicDepartment.route';
import { facultyRoute } from '../modules/faculty/faculty.route';
import { adminRoute } from '../modules/admin/admin.route';
import { courseRoute } from '../modules/course/course.route';
import { courseFacultyRoute } from '../modules/courseFaculty/courseFaculty.route';

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
    path: '/faculty',
    route: facultyRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/academic-semisters',
    route: academicSemisterRoute,
  },
  {
    path: '/academic-faculty',
    route: academicFacultyRoute,
  },
  {
    path: '/academic-department',
    route: academicDepartmentRoute,
  },
  {
    path: '/course',
    route: courseRoute,
  },
  {
    path: '/courseFaculty',
    route: courseFacultyRoute,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
