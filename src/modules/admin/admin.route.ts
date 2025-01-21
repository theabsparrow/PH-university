import { Router } from 'express';
import { adminController } from './admin.controller';
import validateRequest from '../../middlewire/validateRequest';
import { adminValidation } from './admin.validation';
import auth from '../../middlewire/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get('/', auth(USER_ROLE.superAdmin), adminController.getAllAdmin);
router.get('/:id', auth(USER_ROLE.superAdmin), adminController.getSingleAdmin);
router.patch(
  '/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(adminValidation.updateAdminValidationSchema),
  adminController.updateAdmin
);
router.delete('/:id', auth(USER_ROLE.superAdmin), adminController.deleteAdmin);
export const adminRoute = router;
