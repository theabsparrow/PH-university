import { model, Schema } from 'mongoose';
import { TOfferedCourse } from './offeredCourse.interface';
import { Days } from './offeredCourse.constant';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';

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

offeredCourseSchema.pre('save', async function (next) {
  const semisterRegistration = this.semisterRegistration;
  const course = this.course;
  const section = this.section;
  // check if the same offered course with the same section and same semister registration exists
  const isSameOfferedCourseWithtSameSectionExists = await OfferedCourse.findOne(
    {
      semisterRegistration,
      course,
      section,
    }
  );
  if (isSameOfferedCourseWithtSameSectionExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `offered course with same section is already exists`
    );
  }

  const startTime = this.startTime;
  const endTime = this.endTime;
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  if (end <= start) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'end time should be before start time'
    );
  }
  next();
});

export const OfferedCourse = model<TOfferedCourse>(
  'OfferedCourse',
  offeredCourseSchema
);
