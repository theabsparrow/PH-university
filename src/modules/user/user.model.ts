import { model, Schema } from 'mongoose';
import { Tuser, userModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { Status } from './user.constant';

const userSchema = new Schema<Tuser, userModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      // unique: true,
      required: [true, 'email is required'],
    },
    password: {
      type: String,
      required: [true, 'password is required'],
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin', 'superAdmin'],
    },
    status: {
      type: String,
      enum: Status,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_round)
  );
  next();
});
userSchema.pre('save', async function (next) {
  const isIDexist = await User.findOne({
    id: this.id,
  });
  if (isIDexist) {
    throw new AppError(StatusCodes.CONFLICT, 'this Id is already exist');
  }
  next();
});

userSchema.post('save', function (data, next) {
  data.password = '';
  next();
});

userSchema.statics.isPasswordMatched = async function (
  givenPassword,
  matchedPassword
) {
  return await bcrypt.compare(givenPassword, matchedPassword);
};

userSchema.statics.isPasswordChangedAfterJWTIssued = function (
  passwordChangedTime: Date,
  jwtIssuedTime: number
) {
  const changedPasswordAt = new Date(passwordChangedTime).getTime() / 1000;
  return changedPasswordAt > jwtIssuedTime;
};

export const User = model<Tuser, userModel>('User', userSchema);
