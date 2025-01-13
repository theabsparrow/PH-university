import auth from '../../middlewire/auth';
import validateRequest from '../../middlewire/validateRequest';
import { adminValidation } from '../admin/admin.validation';
import { facultyValidation } from '../faculty/faculty.validation';
import { studentValidation } from '../student/student.validation';
import { USER_ROLE } from './user.constant';
import { userController } from './user.controller';
import { Router } from 'express';

const router = Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidation.studentValidationSchema),
  userController.createStudent
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(facultyValidation.facultyValidationSchema),
  userController.createFaculty
);

router.post(
  '/create-admin',
  auth(USER_ROLE.admin),
  validateRequest(adminValidation.adminValidationSchema),
  userController.createAdmin
);

export const userRoute = router;
