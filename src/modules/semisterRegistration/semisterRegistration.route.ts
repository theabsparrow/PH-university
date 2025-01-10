import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { semisterRegistrationValidation } from './semisterRegistration.validation';
import { semisterRegistrationController } from './semisterRegistration.controller';

const router = Router();

router.post(
  '/semister-register',
  validateRequest(
    semisterRegistrationValidation.semisterRegistrationValidationSchema
  ),
  semisterRegistrationController.createSemisterRegistration
);

router.get('/', semisterRegistrationController.getAllRegisteredSemister);
router.get('/:id', semisterRegistrationController.getASingleRegisteredSemister);
router.patch(
  '/:id',
  validateRequest(
    semisterRegistrationValidation.updateSemisterRegistrationValidationSchema
  ),
  semisterRegistrationController.updateRegisteredSemister
);

export const semisterRegistrationRoute = router;
