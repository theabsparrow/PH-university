import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utills/catchAsync';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import { isUserExists } from '../modules/auth/auth.utills';
import { User } from '../modules/user/user.model';

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
    const { userID, userRole, iat } = decoded;

    const userInfo = await isUserExists(userID);
    // check if the user us exists
    if (!userInfo) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        ' User does not exists'
      );
    }
    // check if the user is not deleted
    const deleteUSer = userInfo?.isDeleted;
    if (deleteUSer) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        ' User does not exists'
      );
    }
    //   check if the user is blocked
    const userStatus = userInfo?.status;
    if (userStatus === 'blocked') {
      throw new AppError(StatusCodes.BAD_REQUEST, 'user is blocked');
    }

    // check if password is changed but token isn't expire
    const passwordChangedTime = userInfo?.passwordChangedAt as Date;
    const passwordAndTokenTimeCOmparison = User.isPasswordChangedAfterJWTIssued(
      passwordChangedTime,
      iat as number
    );
    if (passwordAndTokenTimeCOmparison) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorizrd');
    }

    // check if user role doesn't match
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorizrd');
    }
    req.user = decoded as JwtPayload;

    next();
  });
};

export default auth;
