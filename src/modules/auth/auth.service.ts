import { TChangePassword, TLogin } from './auth.interface';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { createToken, isUserExists } from './auth.utills';
import { User } from '../user/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

// user login
const userLogin = async (payload: TLogin) => {
  const { id, password } = payload;
  const user = await isUserExists(id);
  // check if the user us exists
  if (!user) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Login failed. User ID is incorrect'
    );
  }
  // check if the user is not deleted
  const deleteUSer = user?.isDeleted;
  if (deleteUSer) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      'login faild because the user is unavailable'
    );
  }
  //   check if the user is blocked
  const userStatus = user?.status;
  if (userStatus === 'blocked') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'user is blocked');
  }
  //   check the password
  const userPass = user?.password;
  const passwordMatched = await User.isPasswordMatched(password, userPass);
  if (!passwordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, 'password is incorrect');
  }
  const jwtPayload = {
    userID: user?.id,
    userRole: user?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

// change password
const changePassword = async (user: JwtPayload, payload: TChangePassword) => {
  const { userID, userRole } = user;
  const { oldPassword, newPassword } = payload;
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
  //   check the password
  const userPass = userInfo?.password as string;
  const passwordMatched = await User.isPasswordMatched(oldPassword, userPass);
  if (!passwordMatched) {
    throw new AppError(StatusCodes.FORBIDDEN, 'password is incorrect');
  }
  const newHashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_round)
  );
  await User.findOneAndUpdate(
    {
      id: userID,
      role: userRole,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
    { new: true }
  );
  return null;
};

// generate refreshtoken
const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string
  ) as JwtPayload;
  const { userID, iat } = decoded;
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
  // check if password is changed but token isn't expire
  const passwordChangedTime = userInfo?.passwordChangedAt as Date;
  const passwordAndTokenTimeCOmparison = User.isPasswordChangedAfterJWTIssued(
    passwordChangedTime,
    iat as number
  );
  if (passwordAndTokenTimeCOmparison) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'you are not authorizrd');
  }
  const jwtPayload = {
    userID: userInfo?.id,
    userRole: userInfo?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );
  return accessToken;
};

export const authService = {
  userLogin,
  changePassword,
  refreshToken,
};
