import { model, Schema } from 'mongoose';
import { TAcademicSemister } from './academicSemister.interface';
import {
  AcademicSemisterCode,
  AcademicSmeisterName,
  Months,
} from './academicSemister.constant';

const academicSemisterSchema = new Schema<TAcademicSemister>(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      enum: AcademicSmeisterName,
    },
    code: {
      type: String,
      required: [true, 'code is required'],
      enum: AcademicSemisterCode,
    },
    year: {
      type: String,
      required: [true, 'year is required'],
    },
    startMonth: {
      type: String,
      enum: Months,
    },
    endMonth: {
      type: String,
      enum: Months,
    },
  },
  {
    timestamps: true,
  }
);

academicSemisterSchema.pre('save', async function (next) {
  const isSemisterExist = await AcademicSemister.findOne({
    year: this.year,
    name: this.name,
  });
  if (isSemisterExist) {
    throw new Error('this semister is already exists');
  }
  next();
});

export const AcademicSemister = model<TAcademicSemister>(
  'AcademicSemister',
  academicSemisterSchema
);
