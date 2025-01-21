import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { academicDepartmentController } from './academicDepartment.controller';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/create-academic-department',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicDepartmentValidation.academicDepartmentValidationSchema
  ),
  academicDepartmentController.createAcademicDepartment
);
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicDepartmentController.getAllAcademicDepartment
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicDepartmentController.getSingleAcademicDepartment
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidationSchema
  ),
  academicDepartmentController.updateAcademicDepartment
);
export const academicDepartmentRoute = router;
