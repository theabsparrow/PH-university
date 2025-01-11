import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { offeredCourseController } from './offeredCourse.controller';
import { offeredCourseValidation } from './offeredCourse.validation';

const router = Router();
router.post(
  '/create-offeredCourse',
  validateRequest(offeredCourseValidation.offeredCourseValidationSchema),
  offeredCourseController.createOfferedCourse
);
router.get('/', offeredCourseController.getAllOfferedCourse);
router.get('/:id', offeredCourseController.getSingleOfferedCourse);

router.patch(
  '/:id',
  validateRequest(offeredCourseValidation.updateOfferedCourseValidationSchema),
  offeredCourseController.updateOfferedCourse
);

router.delete('/:id', offeredCourseController.deleteOfferedCourse);
export const offeredCourseRoute = router;
