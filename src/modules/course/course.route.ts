import { Router } from 'express';
import { courseColtroller } from './course.controller';
import { courseValidation } from './course.validation';
import validateRequest from '../../middlewire/validateRequest';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseValidation.courseValidationSchema),
  courseColtroller.createCourse
);
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
    USER_ROLE.superAdmin
  ),
  courseColtroller.getAllCourses
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
    USER_ROLE.superAdmin
  ),
  courseColtroller.getASingleCourse
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseValidation.updateCourseValidationSchema),
  courseColtroller.updateACourse
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  courseColtroller.deleteACourse
);

export const courseRoute = router;
