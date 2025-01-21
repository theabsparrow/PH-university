import { Router } from 'express';
import { studentController } from './student.controller';
import validateRequest from '../../middlewire/validateRequest';
import { studentValidation } from './student.validation';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';
import { upload } from '../../utills/uploadImageToCloudinary';
import { parseToJsonFormat } from '../../middlewire/parseJson';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  studentController.getAllStudent
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  studentController.getASingleStudent
);
router.delete(
  '/:studentID',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  studentController.deleteStudent
);
router.patch(
  '/:id',
  auth(USER_ROLE.student, USER_ROLE.superAdmin),
  upload.single('file'),
  parseToJsonFormat,
  validateRequest(studentValidation.updateStudentValidationSchema),
  studentController.updateStudent
);

export const studentRoute = router;
