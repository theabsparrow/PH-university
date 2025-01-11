import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { offeredCourseValidation } from './offeredCourse.validation';
import { offeredCourseController } from './offeredCourse.controller';

const router = Router();
router.post(
  '/create-offeredCourse',
  validateRequest(offeredCourseValidation.offeredCourseValidationSchema),
  offeredCourseController.createOfferedCourse
);

export const offeredCourseRoute = router;
