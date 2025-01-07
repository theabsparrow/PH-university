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
      trim: true,
      required: [true, 'profile image is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      require: [true, 'academic department is required'],
      ref: 'AcademicDepartment',
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

export const Faculty = model<TFaculty>('Faculty', facultySchema);
