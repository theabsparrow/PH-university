import { model, Schema } from 'mongoose';
import { TGuardian, TLocalGuardian, TStudent } from './student.interface';
import { BloodGroup, Gender } from '../../global/constant';
import { userNameSchema } from '../../global/userSchema';
// import AppError from '../../error/AppError';
// import { StatusCodes } from 'http-status-codes';

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, 'father name is required'],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, 'father occupation is required'],
  },
  fatherContactNo: {
    type: String,
    trim: true,
    required: [true, 'father contact no is required'],
  },
  motherName: {
    type: String,
    trim: true,
    required: [true, 'mother name is required'],
  },
  motherOccupation: {
    type: String,
    trim: true,
    required: [true, 'mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    trim: true,
    required: [true, 'mother contact no is required'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    trim: true,
    required: [true, 'local guradian name is required'],
  },
  occupation: {
    type: String,
    trim: true,
    required: [true, 'occupation is required'],
  },
  contactNo: {
    type: String,
    trim: true,
    required: [true, 'contact no is required'],
  },
  address: {
    type: String,
    trim: true,
    required: [true, 'address is required'],
  },
});

const studentSchema = new Schema<TStudent>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user ID is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: userNameSchema,
      required: [true, 'name is required'],
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
      // unique: true,
      required: [true, 'email is required'],
    },
    contactNo: {
      type: String,
      // unique: true,
      required: [true, 'contact no is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'contact no is required'],
    },
    bloodGroup: {
      type: String,
      enum: BloodGroup,
      required: [true, 'blood group is required'],
    },
    presentAddress: {
      type: String,
      trim: true,
      required: [true, 'present address is required'],
    },
    parmanentAddress: {
      type: String,
      trim: true,
      required: [true, 'parmanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'gurardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'local guardian info is required'],
    },
    profileImage: {
      type: String,
      default: ''
    },
    admissionSemister: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemister',
      required: [true, 'admission semister is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic department is required'],
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic department is required'],
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

// studentSchema.pre('save', async function (next) {
//   const isEmailUsed = await Student.findOne({
//     email: this.email,
//   });
//   const isPhoneNumberExist = await Student.findOne({
//     contactNo: this.contactNo,
//   });
//   if (isEmailUsed) {
//     throw new AppError(StatusCodes.CONFLICT, 'this email is already exist');
//   } else if (isPhoneNumberExist) {
//     throw new AppError(
//       StatusCodes.CONFLICT,
//       'this phone number is already exist'
//     );
//   }
//   next();
// });
export const Student = model<TStudent>('Student', studentSchema);
