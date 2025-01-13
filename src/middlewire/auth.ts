import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utills/catchAsync';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // check if the token is provided
    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorizrd');
    }
    // check if the token is valid
    jwt.verify(
      token,
      config.jwt_access_secret as string,
      function (error, decoded) {
        if (error) {
          throw new AppError(
            StatusCodes.UNAUTHORIZED,
            'you are not authorizrd'
          );
        }
        const role = (decoded as JwtPayload)?.userRole;
        if (requiredRoles && !requiredRoles.includes(role)) {
          throw new AppError(
            StatusCodes.UNAUTHORIZED,
            'you are not authorizrd'
          );
        }
        req.user = decoded as JwtPayload;

        next();
      }
    );
  });
};

export default auth;
