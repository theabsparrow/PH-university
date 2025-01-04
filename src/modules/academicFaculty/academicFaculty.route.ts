import { Router } from 'express';
import { academicFacultyController } from './academicFacultyController';
import validateRequest from '../../middlewire/validateRequest';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = Router();

router.post(
  '/create-academic-Faculty',
  validateRequest(academicFacultyValidation.academicFacultyValidationSchema),
  academicFacultyController.createAcademicFaculty
);

router.get('/', academicFacultyController.getAllAcademicFaculty);
router.get('/:id', academicFacultyController.getASingleAcademicFaculty);
router.patch(
  '/:id',
  validateRequest(
    academicFacultyValidation.updateAcademicFacultyValidationSchema
  ),
  academicFacultyController.updateAcademicFaculty
);

export const academicFacultyRoute = router;
