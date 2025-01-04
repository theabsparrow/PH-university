import { Router } from 'express';
import { studentController } from './student.controller';

const router = Router();

router.get('/', studentController.getAllStudent);
router.get('/:id', studentController.getASingleStudent);
router.delete('/:studentID', studentController.deleteStudent);

export const studentRoute = router;
