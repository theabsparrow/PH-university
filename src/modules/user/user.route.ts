import validateRequest from '../../middlewire/validateRequest';
import { studentValidation } from '../student/student.validation';
import { userController } from './user.controller';
import { Router } from 'express';

const router = Router();

router.post(
  '/create-student',
  validateRequest(studentValidation.studentValidationSchema),
  userController.createStudent
);

export const userRoute = router;
