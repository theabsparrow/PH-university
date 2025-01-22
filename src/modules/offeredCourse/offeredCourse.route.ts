import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { offeredCourseController } from './offeredCourse.controller';
import { offeredCourseValidation } from './offeredCourse.validation';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-offeredCourse',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(offeredCourseValidation.offeredCourseValidationSchema),
  offeredCourseController.createOfferedCourse
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  offeredCourseController.getAllOfferedCourse
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  offeredCourseController.getSingleOfferedCourse
);
router.get(
  '/my-offered-course',
  auth(USER_ROLE.student),
  offeredCourseController.getMyOfferedCourse
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(offeredCourseValidation.updateOfferedCourseValidationSchema),
  offeredCourseController.updateOfferedCourse
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  offeredCourseController.deleteOfferedCourse
);
export const offeredCourseRoute = router;
