import { Router } from 'express';
import { facultyController } from './faculty.controller';
import validateRequest from '../../middlewire/validateRequest';
import { facultyValidation } from './faculty.validation';

const router = Router();

router.get('/', facultyController.getAllFaculty);
router.get('/:id', facultyController.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(facultyValidation.updateFacultyValidationSchema),
  facultyController.updateFaculty
);
router.delete('/:id', facultyController.deleteFaculty);

export const facultyRoute = router;
