import { Router } from 'express';
import { userController } from './user.controller';

const router = Router();
router.post('/create-student', userController.createStudent);

export const userRoute = router;
