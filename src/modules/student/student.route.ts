import { Router } from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewire/validateRequest';
import { studentValidation } from './student.validation';

const router = Router();

router.get('/', studentController.getAllStudent);
router.get('/:id', studentController.getASingleStudent);
router.delete('/:studentID', studentController.deleteStudent);
router.patch(
  '/:id',
  validateRequest(studentValidation.updateStudentValidationSchema),
  studentController.updateStudent
);

export const studentRoute = router;
