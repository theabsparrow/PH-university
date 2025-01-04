import { model, Schema } from 'mongoose';
import { TAcademicFaculty } from './academicFaculty.interface';
import { Tquery } from '../../interface';

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
    throw new Error('this academic faculty is already exist');
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
        throw new Error('This name is already taken');
      }
    }
  }
  next();
});
export const AcademicFaculty = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema
);
