import { model, Schema } from 'mongoose';
import { TCourse, TPreRequisite } from './course.interface';

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
      unique: true,
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

export const Course = model<TCourse>('Course', courseSchema);
