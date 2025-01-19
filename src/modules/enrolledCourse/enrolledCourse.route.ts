import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { enrolledCourseValidation } from './enrolledCourse.validation';
import { enrolledCourseController } from './enrolledCourse.controller';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';
import { matchEnrolledCourseFaculty } from '../../middlewire/enrolledCourse.faculty';

const router = Router();
router.post(
  '/create-enrolled-course',
  auth(USER_ROLE.student),
  validateRequest(enrolledCourseValidation.enrolledCourseValidationSchema),
  enrolledCourseController.createEnrolledCourse
);

router.patch(
  '/update-enrolled-course-marks',
  auth(USER_ROLE.faculty),
  validateRequest(
    enrolledCourseValidation.updateEnrolledCourseValidationSchema
  ),
  matchEnrolledCourseFaculty(),
  enrolledCourseController.updateEnrolledCourseMarks
);
export const enrolledCourseRoute = router;
