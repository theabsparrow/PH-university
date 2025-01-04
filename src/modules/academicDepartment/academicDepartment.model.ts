import { model, Schema } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interface';
import { Tquery } from '../../interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: [true, 'deparment name is required'],
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic faculty is required'],
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  }
);

academicDepartmentSchema.pre('save', async function (next) {
  const isDepartmentExist = await AcademicDepartment.findOne({
    name: this.name,
  });
  if (isDepartmentExist) {
    throw new Error('This department is already exist');
  }
  next();
});

academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getUpdate();

  if (query && typeof query === 'object' && !Array.isArray(query)) {
    const name = (query as Tquery).name;
    if (name) {
      const isNameExist = await AcademicDepartment.findOne({ name });
      if (isNameExist) {
        throw new Error('This name is already taken');
      }
    }
  }
  next();
});
export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema
);
