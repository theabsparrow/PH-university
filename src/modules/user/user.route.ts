import auth from '../../middlewire/auth';
import validateRequest from '../../middlewire/validateRequest';
import { adminValidation } from '../admin/admin.validation';
import { facultyValidation } from '../faculty/faculty.validation';
import { studentValidation } from '../student/student.validation';
import { USER_ROLE } from './user.constant';
import { userController } from './user.controller';
import { Router } from 'express';
import { userValidation } from './user.validation';
import { upload } from '../../utills/uploadImageToCloudinary';
import { parseToJsonFormat } from '../../middlewire/parseJson';

const router = Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  parseToJsonFormat,
  validateRequest(studentValidation.studentValidationSchema),
  userController.createStudent
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  upload.single('file'),
  parseToJsonFormat,
  validateRequest(facultyValidation.facultyValidationSchema),
  userController.createFaculty
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  upload.single('file'),
  parseToJsonFormat,
  validateRequest(adminValidation.adminValidationSchema),
  userController.createAdmin
);

router.get(
  '/me',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  userController.getMe
);

router.patch(
  '/change-status/:id',
  auth(USER_ROLE.admin),
  validateRequest(userValidation.changeUserStatusValidationSchema),
  userController.changeUserStatus
);
export const userRoute = router;
