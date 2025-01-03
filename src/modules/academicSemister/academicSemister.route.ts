import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { academicSemisterValidation } from './academicSemister.validation';
import { academicSemisterController } from './academicSemister.controller';

const router = Router();

router.post(
  '/create-academic-semister',
  validateRequest(academicSemisterValidation.academicSemisterValidationSchema),
  academicSemisterController.createAcademicSemister
);

router.get('/', academicSemisterController.getAllAcademicSemister);
router.get('/:id', academicSemisterController.getASingleAcademicSemister);
router.patch(
  '/:id',
  validateRequest(
    academicSemisterValidation.updateAcademicSemisterVAlidationSchema
  ),
  academicSemisterController.updateAcademicSemister
);
export const academicSemisterRoute = router;
