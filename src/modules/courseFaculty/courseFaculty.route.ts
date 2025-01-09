import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { courseFacultyValidation } from './courseFaculty.validation';
import { courseFAcultyController } from './courseFaculty.controller';

const router = Router();
router.put(
  '/:courseID/assign-faculties',
  validateRequest(courseFacultyValidation.courseFAcultiesValidationSchema),
  courseFAcultyController.assignFacultiesIntoDB
);

router.delete(
  '/:courseID/remove-faculties',
  validateRequest(courseFacultyValidation.courseFAcultiesValidationSchema),
  courseFAcultyController.removeFaculties
);
export const courseFacultyRoute = router;
