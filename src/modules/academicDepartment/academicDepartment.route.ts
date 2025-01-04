import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { academicDepartmentValidation } from './academicDepartment.validation';
import { academicDepartmentController } from './academicDepartment.controller';

const router = Router();
router.post(
  '/create-academic-department',
  validateRequest(
    academicDepartmentValidation.academicDepartmentValidationSchema
  ),
  academicDepartmentController.createAcademicDepartment
);
router.get('/', academicDepartmentController.getAllAcademicDepartment);
router.get('/:id', academicDepartmentController.getSingleAcademicDepartment);
router.patch(
  '/:id',
  validateRequest(
    academicDepartmentValidation.updateAcademicDepartmentValidationSchema
  ),
  academicDepartmentController.updateAcademicDepartment
);
export const academicDepartmentRoute = router;
