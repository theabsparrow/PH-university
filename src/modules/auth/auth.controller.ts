/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { CookieOptions, NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { authService } from './auth.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import config from '../../config';

const userLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.userLogin(payload);
    const { refreshToken, accessToken, needsPasswordChange } = result;

    const cookieOptions: CookieOptions = {
      secure: config.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 365,
    };

    res.cookie('refreshToken', refreshToken, cookieOptions);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'login successfully',
      data: {
        accessToken,
        needsPasswordChange,
      },
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

const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    const result = await authService.refreshToken(refreshToken);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'access token retrived successfully',
      data: result,
    });
  }
);

const forgrtPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body;
    const result = await authService.forgetPassword(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'link generated successfully',
      data: result,
    });
  }
);

const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await authService.resetPassword(payload, req.user);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'password reset successfully',
      data: result,
    });
  }
);

export const authController = {
  userLogin,
  changePassword,
  refreshToken,
  forgrtPassword,
  resetPassword,
};
