/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { Student } from '../student/student.model';
import { EnrolledCourse } from './enrolledCourse.model';
import mongoose, { Types } from 'mongoose';
import { SemisterRegistration } from '../semisterRegistration/semisterRegistration.model';
import { Course } from '../course/course.model';

const createEnrolledCourse = async (
  payload: TEnrolledCourse,
  userID: string
) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);
  // check if the offer course is exists
  if (!isOfferedCourseExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this offer course does not exists'
    );
  }
  const maxCapacity = isOfferedCourseExists?.maxCapacity;
  const semisterRegistration = isOfferedCourseExists?.semisterRegistration;
  // check if the max capacity is available
  if (maxCapacity <= 0) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'room is full');
  }
  // check if the students exists
  const isStudentExists = await Student.findOne({ id: userID }).select('_id');
  if (!isStudentExists) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'this student does not exists');
  }
  const studentID = isStudentExists?._id;
  // check if the student already enrolled the same course
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semisterRegistration: semisterRegistration,
    offeredCourse,
    student: studentID,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'this student already enrolled'
    );
  }
  // check if the semister registration exists
  const isSemisterRegistrationExists = await SemisterRegistration.findById(
    semisterRegistration
  ).select('maxCredit');
  if (!isSemisterRegistrationExists) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'semister resgistration does not exists'
    );
  }
  const maxCredit = isSemisterRegistrationExists?.maxCredit;
  const courseID = isOfferedCourseExists?.course;
  const isCourseExists = await Course.findById(courseID).select('credit');
  const newEnrolledCredit = isCourseExists?.credit;

  // check if the max credit is not larger than the course credit
  const enrolledCourse = await EnrolledCourse.aggregate([
    {
      $match: {
        semisterRegistration: semisterRegistration,
        student: studentID,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCredits: { $sum: '$enrolledCourseData.credit' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCredits: 1,
      },
    },
  ]);
  const totalCredits =
    enrolledCourse.length > 0 ? enrolledCourse[0].totalEnrolledCredits : 0;
  if (totalCredits && totalCredits + newEnrolledCredit > maxCredit) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'you have exceeded maximum number of credits'
    );
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // finally create enrolled offer course
    payload.semisterRegistration = isOfferedCourseExists?.semisterRegistration;
    payload.academicSemister =
      isOfferedCourseExists?.academicSemister as Types.ObjectId;
    payload.academicFaculty = isOfferedCourseExists?.academicFaculty;
    payload.academicDepartment = isOfferedCourseExists?.academicDepartment;
    payload.offeredCourse = offeredCourse;
    payload.course = isOfferedCourseExists?.course;
    payload.student = isStudentExists?._id;
    payload.faculty = isOfferedCourseExists?.faculty;

    const result = await EnrolledCourse.create([payload], { session });
    if (!result.length) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'failed to crete enrolled course'
      );
    }
    const decreaseMaxCapacity = await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      { maxCapacity: maxCapacity - 1 },
      { new: true, session }
    );
    if (!decreaseMaxCapacity) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'failed to crete enrolled course'
      );
    }
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

export const enrolledCourseService = {
  createEnrolledCourse,
};
