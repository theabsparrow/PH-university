import { model, Schema } from 'mongoose';
import { TCourse, TPreRequisite } from './course.interface';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';

const coursePreRequisiteSchema = new Schema<TPreRequisite>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});
const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: [true, 'title is required'],
      //   unique: true,
      trim: true,
    },
    prefix: {
      type: String,
      required: [true, 'prefix is required'],
      trim: true,
    },
    code: {
      type: Number,
      required: [true, 'code is requied'],
      //   unique: true,
    },
    credit: {
      type: Number,
      required: [true, 'credit is required'],
    },
    preRequisite: [coursePreRequisiteSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

courseSchema.pre('save', async function (next) {
  //   const isTitleExist = await Course.findOne({ title: this.title });
  //   const isCodeExist = await Course.findOne({ code: this.code });
  //   if (isTitleExist) {
  //     throw new AppError(StatusCodes.CONFLICT, 'This title is already exist');
  //   } else if (isCodeExist) {
  //     throw new AppError(
  //       StatusCodes.CONFLICT,
  //       'this course code is already exist, try differnet one'
  //     );
  //   }
  const preRequisiteCourses = this.preRequisite;

  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    for (const preRequisiteCourse of preRequisiteCourses) {
      const { course } = preRequisiteCourse;
      const isExistCourse = await Course.findById(course);
      if (!isExistCourse) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          'the prerequisite course you have provided doesn`t exist'
        );
      }
    }
  }
  next();
});

courseSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getUpdate();

  if (query && typeof query === 'object' && !Array.isArray(query)) {
    const title = query.title;
    const code = query.code;
    const isNameExist = await Course.findOne({ title });
    const isCodeExist = await Course.findOne({ code });
    if (isNameExist) {
      throw new AppError(StatusCodes.CONFLICT, 'This title is already exists');
    } else if (isCodeExist) {
      throw new AppError(StatusCodes.CONFLICT, 'This code is already exists');
    }
  }
  next();
});

export const Course = model<TCourse>('Course', courseSchema);
