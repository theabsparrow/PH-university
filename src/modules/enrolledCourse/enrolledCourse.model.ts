import { model, Schema } from 'mongoose';
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface';
import { Grade } from './enrolledCourse.constant';

const courseMarksSchema = new Schema<TCourseMarks>({
  classTest1: {
    type: Number,
    default: 0,
  },
  midTerm: {
    type: Number,
    default: 0,
  },
  classTest2: {
    type: Number,
    default: 0,
  },
  finalTerm: {
    type: Number,
    default: 0,
  },
});

const enrolledCourseSchema = new Schema<TEnrolledCourse>(
  {
    semisterRegistration: {
      type: Schema.Types.ObjectId,
      ref: 'SemisterRegistration',
      required: [true, 'semister registration is required'],
    },
    academicSemister: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemister',
      required: [true, 'academic semister is required'],
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: [true, 'academic faculty is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: [true, 'academic department is required'],
    },
    offeredCourse: {
      type: Schema.Types.ObjectId,
      ref: 'OfferedCourse',
      required: [true, 'offered course is required'],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'course is required'],
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'student is required'],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'faculty is required'],
    },
    isEnrolled: {
      type: Boolean,
      default: true,
    },
    courseMarks: {
      type: courseMarksSchema,
      default: {}
    },
    grade: {
      type: String,
      enum: Grade,
      default: 'NA',
    },
    gradePoints: {
      type: Number,
      min: [0, 'grade points can`t be less than 0'],
      max: [4, 'grade points can`t be more that 4'],
      default: 0,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const EnrolledCourse = model<TEnrolledCourse>(
  'EnrolledCourse',
  enrolledCourseSchema
);
