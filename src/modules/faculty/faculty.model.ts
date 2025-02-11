// import { StatusCodes } from 'http-status-codes';
// import AppError from '../../error/AppError';
import { BloodGroup, Gender } from '../../global/constant';
import { userNameSchema } from '../../global/userSchema';
import { TFaculty } from './faculty.interface';
import { model, Schema } from 'mongoose';

const facultySchema = new Schema<TFaculty>(
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
    designation: {
      type: String,
      required: [true, ' designation is required'],
      trim: true,
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
    academicDepartment: {
      type: Schema.Types.ObjectId,
      require: [true, 'academic department is required'],
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      require: [true, 'academic department is required'],
      ref: 'AcademicFaculty',
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

// facultySchema.pre('save', async function (next) {
//   const isEmailUsed = await Faculty.findOne({ email: this.email });
//   if (isEmailUsed) {
//     throw new AppError(StatusCodes.CONFLICT, 'this email is already used');
//   }
//   const isPhoneExist = await Faculty.findOne({ contactNo: this.contactNo });
//   if (isPhoneExist) {
//     throw new AppError(
//       StatusCodes.CONFLICT,
//       'this phone number is aleready exists'
//     );
//   }
//   next();
// });

export const Faculty = model<TFaculty>('Faculty', facultySchema);
