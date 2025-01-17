import { Router } from 'express';
import { facultyController } from './faculty.controller';
import validateRequest from '../../middlewire/validateRequest';
import { facultyValidation } from './faculty.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewire/auth';

const router = Router();

router.get('/', auth(USER_ROLE.admin), facultyController.getAllFaculty);
router.get('/:id', auth(USER_ROLE.admin), facultyController.getSingleFaculty);
router.patch(
  '/:id',
  auth(USER_ROLE.faculty),
  validateRequest(facultyValidation.updateFacultyValidationSchema),
  facultyController.updateFaculty
);
router.delete('/:id', auth(USER_ROLE.admin), facultyController.deleteFaculty);

export const facultyRoute = router;
