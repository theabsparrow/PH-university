import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utills/catchAsync';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { isUserExists } from '../modules/auth/auth.utills';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // check if the token is provided
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorizrd');
    }
    // check if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;
    const { userID, userRole } = decoded;

    const userInfo = await isUserExists(userID);
    // check if the user us exists
    if (!userInfo) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'Login failed. User ID is incorrect'
      );
    }
    // check if the user is not deleted
    const deleteUSer = userInfo?.isDeleted;
    if (deleteUSer) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        'login faild because the user is unavailable'
      );
    }
    //   check if the user is blocked
    const userStatus = userInfo?.status;
    if (userStatus === 'blocked') {
      throw new AppError(StatusCodes.BAD_REQUEST, 'user is blocked');
    }
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorizrd');
    }
    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
