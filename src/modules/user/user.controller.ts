import { Request, Response } from 'express';
import { userService } from './user.service';

const createStudent = async (req: Request, res: Response) => {
  const { password, student } = req.body;
  const result = await userService.createStudent(password, student);
  res.send(result);
};
export const userController = {
  createStudent,
};
