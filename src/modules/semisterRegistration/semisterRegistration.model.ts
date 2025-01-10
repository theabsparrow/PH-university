import { model, Schema } from 'mongoose';
import { TSemisterRegistration } from './semisterRegistration.interface';
import { semisterRegistrationStatus } from './semisterRegistration.constant';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';

const semisterRegistrationSchema = new Schema<TSemisterRegistration>(
  {
    academicSemister: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic semister is required'],
      ref: 'AcademicSemister',
      unique: true,
    },
    status: {
      type: String,
      enum: semisterRegistrationStatus,
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: [true, 'start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'end date is required'],
    },
    minCredit: {
      type: Number,
      default: 3,
    },
    maxCredit: {
      type: Number,
      default: 16,
    },
  },
  {
    timestamps: true,
  }
);

semisterRegistrationSchema.pre('save', async function (next) {
  const isAcademicSemisterExists = await AcademicSemister.findById(
    this.academicSemister
  );
  if (!isAcademicSemisterExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'academic semister not found');
  }

  const isSemisterRegisteredPreviously = await SemisterRegistration.findOne({
    academicSemister: this.academicSemister,
  });
  if (isSemisterRegisteredPreviously) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'this semister is already registered'
    );
  }
  next();
});

export const SemisterRegistration = model<TSemisterRegistration>(
  'SemisterRegistration',
  semisterRegistrationSchema
);
