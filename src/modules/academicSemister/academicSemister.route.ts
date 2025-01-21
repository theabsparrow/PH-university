import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { academicSemisterValidation } from './academicSemister.validation';
import { academicSemisterController } from './academicSemister.controller';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-semister',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(academicSemisterValidation.academicSemisterValidationSchema),
  academicSemisterController.createAcademicSemister
);

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicSemisterController.getAllAcademicSemister
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  academicSemisterController.getASingleAcademicSemister
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    academicSemisterValidation.updateAcademicSemisterVAlidationSchema
  ),
  academicSemisterController.updateAcademicSemister
);
export const academicSemisterRoute = router;
