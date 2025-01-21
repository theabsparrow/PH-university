import { model, Schema } from 'mongoose';
import { TAdmin } from './admin.interface';
import { userNameSchema } from '../../global/userSchema';
import { BloodGroup, Gender } from '../../global/constant';
// import AppError from '../../error/AppError';
// import { StatusCodes } from 'http-status-codes';

const adminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'user name is required'],
    },
    gender: {
      type: String,
      enum: Gender,
      required: [true, 'gender is required'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'date of birth is required'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'email is required'],
      // unique: true
    },
    contactNo: {
      type: String,
      required: [true, 'contact no is required'],
      // unique: true,
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'emergency comtact no is required'],
    },
    bloodGroup: {
      type: String,
      enum: BloodGroup,
      required: [true, 'blood group is required'],
    },
    presentAddress: {
      type: String,
      trim: true,
      required: [true, 'present address is requied'],
    },
    parmanentAddress: {
      type: String,
      trim: true,
      required: [true, 'parmanent address is required'],
    },
    profileImage: {
      type: String,
      default: '',
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

// adminSchema.pre('save', async function (next) {
//   const isEmaiUsed = await Admin.findOne({ email: this.email });
//   const isPhoneERxist = await Admin.findOne({ contactNo: this.contactNo });
//   if (isEmaiUsed) {
//     throw new AppError(StatusCodes.CONFLICT, 'this email is already used');
//   } else if (isPhoneERxist) {
//     throw new AppError(
//       StatusCodes.CONFLICT,
//       'this phone number is already exists'
//     );
//   }
//   next();
// });

export const Admin = model<TAdmin>('Admin', adminSchema);
