/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TCourseMarks, TEnrolledCourse } from './enrolledCourse.interface';
import { Student } from '../student/student.model';
import { EnrolledCourse } from './enrolledCourse.model';
import mongoose, { Types } from 'mongoose';
import { SemisterRegistration } from '../semisterRegistration/semisterRegistration.model';
import { Course } from '../course/course.model';
import {
  calculateGradeAndPoints,
  getOfferCourse,
} from './enrolledCourse.utills';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnrolledCourse = async (
  payload: TEnrolledCourse,
  userID: string
) => {
  const { offeredCourse } = payload;
  const isOfferedCourseExists = await getOfferCourse(offeredCourse);
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
  // transaction rollback starts
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

const getMyEnrolledCourse = async (
  id: string,
  payload: Record<string, unknown>
) => {
  const studentIDExists = await Student.findOne({ id: id }).select({ _id: 1 });
  if (!studentIDExists) {
    throw new AppError(StatusCodes.FORBIDDEN, 'forbidden access');
  }
  const studentID = studentIDExists?._id;
  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: studentID }).populate('semisterRegistration academicSemister'),
    payload
  )
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await enrolledCourseQuery.modelQuery;
  if (!result.length) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'you didn`t enroll any course yet'
    );
  }
  const meta = await enrolledCourseQuery.countTotal();
  return { meta, result };
};

const updateEnrolledCourseMarks = async (
  payload: Partial<TEnrolledCourse>,
  enrolledCourseID: Types.ObjectId
) => {
  const { semisterRegistration, offeredCourse, student, courseMarks } = payload;
  const enrolledCourseExists = await EnrolledCourse.findById(enrolledCourseID);
  const { classTest1, midTerm, classTest2, finalTerm } =
    enrolledCourseExists?.courseMarks as TCourseMarks;
  // check if the semister registration exists
  const isSemisterRegistrationExists = await SemisterRegistration.findById(
    semisterRegistration
  );
  if (!isSemisterRegistrationExists) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'semister resgistration does not exists'
    );
  }
  // check if the offered course exists
  await getOfferCourse(offeredCourse!);
  //  check if the student is wxists
  const isStudentExists = await Student.findById(student);
  if (!isStudentExists) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'student does not exists');
  }
  const modifiedMarksData: Record<string, unknown> = {};

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedMarksData[`courseMarks.${key}`] = value;
    }
  }
  // check if the class test 1 mark is updated first
  if (
    !classTest1 &&
    Object.keys(modifiedMarksData).length &&
    !Object.keys(modifiedMarksData).includes('courseMarks.classTest1')
  ) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'you have to update the class test 1 marks first'
    );
  }
  // check if the mid term mark is updated second
  else if (
    !midTerm &&
    Object.keys(modifiedMarksData).length &&
    !Object.keys(modifiedMarksData).includes('courseMarks.midTerm') &&
    (Object.keys(modifiedMarksData).includes('courseMarks.classTest2') ||
      Object.keys(modifiedMarksData).includes('courseMarks.finalTerm'))
  ) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'you have to update the mid term marks first'
    );
  }
  // check if the class test mark is updated last
  else if (
    !classTest2 &&
    Object.keys(modifiedMarksData).length &&
    !Object.keys(modifiedMarksData).includes('courseMarks.classTest2') &&
    Object.keys(modifiedMarksData).includes('courseMarks.finalTerm')
  ) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'you have to update the class test 2 marks first'
    );
  }

  if (courseMarks?.finalTerm) {
    const totalMarks =
      Math.ceil(classTest1 || courseMarks?.classTest1) +
      Math.ceil(midTerm || courseMarks?.midTerm ) +
      Math.ceil(classTest2 || courseMarks?.classTest2) +
      Math.ceil(finalTerm || courseMarks?.finalTerm );
    const result = calculateGradeAndPoints(totalMarks);
    modifiedMarksData.grade = result?.grade;
    modifiedMarksData.gradePoints = result?.gradePoints;
    modifiedMarksData.isCompleted = true;
  }
  const result = await EnrolledCourse.findByIdAndUpdate(
    enrolledCourseID,
    modifiedMarksData,
    { new: true }
  );
  return result;
};
export const enrolledCourseService = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourse,
};
