/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { courseSearchAbleFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import mongoose from 'mongoose';

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourse = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisite.course'),
    query
  )
    .search(courseSearchAbleFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();

  const result = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();
  return {meta,result};
};

const getASingleCourse = async (id: string) => {
  const result = await Course.findById(id).populate('preRequisite.course');
  if (!result || result.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this course does not exists');
  }
  return result;
};

const updateACourse = async (id: string, payload: Partial<TCourse>) => {
  const isCourseExist = await Course.findOne({ _id: id });
  if (!isCourseExist || isCourseExist.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'course does`t found');
  }

  const { preRequisite, ...remainingCourseData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // basic data update
    const updateBasicData = await Course.findOneAndUpdate(
      { _id: id },
      remainingCourseData,
      { new: true, runValidators: true, session }
    );
    if (!updateBasicData) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'Faild to update data');
    }
    if (preRequisite && preRequisite.length > 0) {
      // check if the prerequisite is exist
      for (const preRequisiteCourse of preRequisite) {
        const { course } = preRequisiteCourse;
        const isExistCourse = await Course.findById(course);
        if (!isExistCourse) {
          throw new AppError(
            StatusCodes.NOT_FOUND,
            'the prerequisite course you have provided doesn`t exist'
          );
        }
      }

      // delete the prerequisite courses
      const deletePreRequisiteCoursesID = preRequisite
        .filter((element) => element.course && element.isDeleted)
        .map((ele) => ele.course);

      const deletePreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisite: { course: { $in: deletePreRequisiteCoursesID } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!deletePreRequisiteCourses) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Faild to update data');
      }

      // add the prerequisite courses
      const addPreRequisiteCoursesID = preRequisite.filter(
        (element) => element.course && !element.isDeleted
      );

      const addPreRequisiteCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisite: { $each: addPreRequisiteCoursesID },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        }
      );
      if (!addPreRequisiteCourse) {
        throw new AppError(StatusCodes.BAD_REQUEST, 'Faild to update data');
      }

      const updatedData = await Course.findById(id).populate(
        'preRequisite.course'
      );
      return updatedData;
    }

    await session.commitTransaction();
    await session.endSession();
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

const deleteACourse = async (id: string) => {
  const isCourseExist = await Course.findById(id);
  if (!isCourseExist || isCourseExist.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This course does not found');
  }
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const courseService = {
  createCourse,
  getAllCourse,
  getASingleCourse,
  updateACourse,
  deleteACourse,
};
