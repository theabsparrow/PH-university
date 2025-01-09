import { model, Schema } from 'mongoose';
import { TCourse, TPreRequisite } from './course.interface';
// import AppError from '../../error/AppError';
// import { StatusCodes } from 'http-status-codes';

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

// courseSchema.pre('save', async function (next) {
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
//   next();
// });

export const Course = model<TCourse>('Course', courseSchema);
