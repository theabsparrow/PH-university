import { model, Schema } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';

const offeredCourseSchema = new Schema<TOfferedCourse>(
  {
    semisterRegistration: {
      type: Schema.Types.ObjectId,
      required: [true, 'semister registration is required'],
      ref: 'SemisterRegistration',
    },
    academicSemister: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic semister is required'],
      ref: 'AcademicSemister',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic faculty is required'],
      ref: 'AcademicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'academic department is required'],
      ref: 'AcademicDepartment',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'course is required'],
      ref: 'Course',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'faculty is required'],
      ref: 'Course',
    },
    maxCapacity: {
      type: Number,
      required: [true, 'max capacity is required'],
    },
    section: {
      type: Number,
      required: [true, 'section is required'],
    },
    days: [
      {
        type: String,
        enum: Days,
        required: [true, 'day is required'],
      },
    ],
    startTime: {
      type: String,
      required: [true, 'start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'end time is required'],
    },
  },
  {
    timestamps: true,
  }
);

export const OfferedCourse = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema
);
