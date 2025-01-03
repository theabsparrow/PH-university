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

export const academicSemisterRoute = router;
