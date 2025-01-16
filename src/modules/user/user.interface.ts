/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface Tuser {
  id: string;
  email: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  role: 'admin' | 'student' | 'faculty';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}
export interface userModel extends Model<Tuser> {
  isPasswordMatched(
    givenPassword: string,
    matchedPassword: string
  ): Promise<boolean>;
  isPasswordChangedAfterJWTIssued(
    passwordChangeTime: Date,
    jwtIssuedTime: number
  ): boolean;
}

export type TResetPassword = {
  id: string;
  newPassword: string;
};
export type TUserRole = keyof typeof USER_ROLE;
