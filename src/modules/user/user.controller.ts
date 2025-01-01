import { NextFunction, Request, Response } from 'express';
import { userService } from './user.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password, student } = req.body;
    const result = await userService.createStudent(password, student);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'student is created successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};
export const userController = {
  createStudent,
};
