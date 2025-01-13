import { Schema } from 'mongoose';
import { TUserName } from '../interface/global';

export const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'first name is required'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'last name is required'],
  },
});
