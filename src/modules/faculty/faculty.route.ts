import { Router } from 'express';
import { facultyController } from './faculty.controller';
import validateRequest from '../../middlewire/validateRequest';
import { facultyValidation } from './faculty.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewire/auth';
import { upload } from '../../utills/uploadImageToCloudinary';
import { parseToJsonFormat } from '../../middlewire/parseJson';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  facultyController.getAllFaculty
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  facultyController.getSingleFaculty
);
router.patch(
  '/:id',
  auth(USER_ROLE.faculty, USER_ROLE.superAdmin),
  upload.single('file'),
  parseToJsonFormat,
  validateRequest(facultyValidation.updateFacultyValidationSchema),
  facultyController.updateFaculty
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  facultyController.deleteFaculty
);

export const facultyRoute = router;
