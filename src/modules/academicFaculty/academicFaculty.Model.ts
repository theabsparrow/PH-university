import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { Tquery } from '../../interface';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'academic faculty is needed'],
    },
  },
  {
    timestamps: true,
  }
);
academicFacultySchema.pre('save', async function (next) {
  const isAcademicFacultyExist = await AcademicFaculty.findOne({
    name: this.name,
  });
  if (isAcademicFacultyExist) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'this academic faculty is already exist'
    );
  }
  next();
});

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getUpdate();

  if (query && typeof query === 'object' && !Array.isArray(query)) {
    const name = (query as Tquery).name;
    if (name) {
      const isNameExist = await AcademicFaculty.findOne({ name });
      if (isNameExist) {
        throw new AppError(StatusCodes.CONFLICT, 'This name is already taken');
      }
    }
  }
  next();
});
export const AcademicFaculty = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema
);
