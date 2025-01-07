import validateRequest from '../../middlewire/validateRequest';
import { adminValidation } from '../admin/admin.validation';
import { facultyValidation } from '../faculty/faculty.validation';
import { studentValidation } from '../student/student.validation';
import { userController } from './user.controller';
import { Router } from 'express';

const router = Router();

router.post(
  '/create-student',
  validateRequest(studentValidation.studentValidationSchema),
  userController.createStudent
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidation.facultyValidationSchema),
  userController.createFaculty
);

router.post(
  '/create-admin',
  validateRequest(adminValidation.adminValidationSchema),
  userController.createAdmin
);

export const userRoute = router;
