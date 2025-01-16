import { User } from '../user/user.model';
import jwt, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const isUserExists = async (id: string) => {
  const isUserExistsByCustomID = await User.findOne({ id }).select('+password');
  return isUserExistsByCustomID;
};

type TJwtPayload = {
  userID: string;
  userRole: string;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;
  return decoded;
};

export const hashedPassrod = async (newPassword: string, number: number) => {
  const newHashedPassword = await bcrypt.hash(newPassword, number);
  return newHashedPassword;
};
