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

router.patch(
  '/:id',
  validateRequest(offeredCourseValidation.updateOfferedCourseValidationSchema),
  offeredCourseController.updateOfferedCourse
);
export const offeredCourseRoute = router;
