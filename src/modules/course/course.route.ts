import { Router } from 'express';
import { courseColtroller } from './course.controller';
import { courseValidation } from './course.validation';
import validateRequest from '../../middlewire/validateRequest';

const router = Router();

router.post(
  '/create-course',
  validateRequest(courseValidation.courseValidationSchema),
  courseColtroller.createCourse
);
router.get('/', courseColtroller.getAllCourses);
router.get('/:id', courseColtroller.getASingleCourse);
router.patch(
  '/:id',
  validateRequest(courseValidation.updateCourseValidationSchema),
  courseColtroller.updateACourse
);
router.delete('/id', courseColtroller.deleteACourse);

export const courseRoute = router;
