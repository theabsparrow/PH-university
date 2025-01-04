import { model, Schema } from 'mongoose';
import { Tuser } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<Tuser>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
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
    throw new Error('this Id is already exist');
  }
  next();
});
userSchema.post('save', function (data, next) {
  data.password = '';
  next();
});

export const User = model<Tuser>('User', userSchema);
