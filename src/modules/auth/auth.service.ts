import { TChangePassword, TLogin } from './auth.interface';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { isUserExists } from './auth.utills';
import { User } from '../user/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import bcrypt from 'bcrypt';

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
  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '10d',
  });
  return {
    accessToken,
    needsPasswordChange: user?.needsPasswordChange,
  };
};

const changePassword = async (user: JwtPayload, payload: TChangePassword) => {
  const { userID, userRole } = user;

  const { oldPassword, newPassword } = payload;
  const userInfo = await isUserExists(userID);
  // check if the user us exists
  if (!user) {
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
export const authService = {
  userLogin,
  changePassword,
};
