import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { semisterRegistrationValidation } from './semisterRegistration.validation';
import { semisterRegistrationController } from './semisterRegistration.controller';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/semister-register',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    semisterRegistrationValidation.semisterRegistrationValidationSchema
  ),
  semisterRegistrationController.createSemisterRegistration
);

router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  semisterRegistrationController.getAllRegisteredSemister
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.superAdmin,
    USER_ROLE.faculty,
    USER_ROLE.student
  ),
  semisterRegistrationController.getASingleRegisteredSemister
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(
    semisterRegistrationValidation.updateSemisterRegistrationValidationSchema
  ),
  semisterRegistrationController.updateRegisteredSemister
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  semisterRegistrationController.deleteRegisteredSemister
);
export const semisterRegistrationRoute = router;
