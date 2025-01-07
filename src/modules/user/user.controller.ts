/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { userService } from './user.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utills/catchAsync';

const createStudent = catchAsync(async (req, res, next) => {
  const { password, student } = req.body;
  const result = await userService.createStudent(password, student);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'student is created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res, next) => {
  const { password, faculty } = req.body;
  const result = await userService.createFAculty(password, faculty);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Faculty is created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res, next) => {
  const { password, admin } = req.body;
  const result = await userService.createAdmin(password, admin);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Admin is created successfully',
    data: result,
  });
});
export const userController = {
  createStudent,
  createFaculty,
  createAdmin,
};
