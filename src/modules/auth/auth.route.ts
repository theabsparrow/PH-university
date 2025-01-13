import { Router } from 'express';
import validateRequest from '../../middlewire/validateRequest';
import { loginValidation } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
router.post(
  '/login',
  validateRequest(loginValidation.loginValidationSchema),
  authController.userLogin
);

router.post(
  '/change-password',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  validateRequest(loginValidation.passwordChangeValidationSchema),
  authController.changePassword
);
export const authRoutes = router;
