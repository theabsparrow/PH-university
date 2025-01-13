/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { authService } from './auth.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.userLogin(payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'login successfully',
      data: result,
    });
  }
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.changePassword(req.user, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'password updated successfully',
      data: result,
    });
  }
);

export const authController = {
  userLogin,
  changePassword,
};
