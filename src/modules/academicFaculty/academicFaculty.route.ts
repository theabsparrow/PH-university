import { Router } from 'express';
import { academicFacultyController } from './academicFacultyController';
import validateRequest from '../../middlewire/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-Faculty',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(academicFacultyValidation.academicFacultyValidationSchema),
  academicFacultyController.createAcademicFaculty
);

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicFacultyController.getAllAcademicFaculty
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicFacultyController.getASingleAcademicFaculty
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema
  ),
  academicFacultyController.updateAcademicFaculty
);

export const academicFacultyRoute = router;
