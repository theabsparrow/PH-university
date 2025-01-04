import { model, Schema } from 'mongoose';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import { BloodGroup, Gender } from './student.constant';

const userNameSchema = new Schema<TUserName>({
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
      trim: true,
    },
    admissionSemister: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemister',
      required: [true, 'admission semister is required'],
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

studentSchema.pre('save', async function (next) {
  const isEmailUsed = await Student.findOne({
    email: this.email,
  });
  const isPhoneNumberExist = await Student.findOne({
    contactNo: this.contactNo,
  });
  const isStudentIDexist = await Student.findOne({
    id: this.id,
  });
  if (isEmailUsed) {
    throw new Error('this email is already exist');
  } else if (isPhoneNumberExist) {
    throw new Error('this phone number is already exist');
  } else if (isStudentIDexist) {
    throw new Error('this student ID is already exist');
  }
  next();
});
export const Student = model<TStudent>('Student', studentSchema);
