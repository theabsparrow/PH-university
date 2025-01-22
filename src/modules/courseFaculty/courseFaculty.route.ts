import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { courseFacultyValidation } from './courseFaculty.validation';
import { courseFAcultyController } from './courseFaculty.controller';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.put(
  '/:courseID/assign-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseFacultyValidation.courseFAcultiesValidationSchema),
  courseFAcultyController.assignFacultiesIntoDB
);

router.get(
  '/:courseID/get-faculty',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  courseFAcultyController.getFacultiesWithCourse
);

router.delete(
  '/:courseID/remove-faculties',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(courseFacultyValidation.courseFAcultiesValidationSchema),
  courseFAcultyController.removeFaculties
);
export const courseFacultyRoute = router;
