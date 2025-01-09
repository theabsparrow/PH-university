import { model, Schema } from 'mongoose';
import { TCourseFaculty } from './courseFaculty.interface';

const coursefacultySchema = new Schema<TCourseFaculty>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      unique: true,
    },
    faculties: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Faculty',
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  coursefacultySchema
);
