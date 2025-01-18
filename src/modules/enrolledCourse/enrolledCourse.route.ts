import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { enrolledCourseValidation } from './enrolledCourse.validation';
import { enrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(enrolledCourseValidation.enrolledCourseValidationSchema),
  enrolledCourseController.createEnrolledCourse
);

export const enrolledCourseRoute = router;
