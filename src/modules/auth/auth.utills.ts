import { User } from '../user/user.model';
import jwt from 'jsonwebtoken';

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
