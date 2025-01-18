import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { Student } from '../student/student.model';
import { EnrolledCourse } from './enrolledCourse.model';
import { Types } from 'mongoose';

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
  // check if the max capacity is available
  const maxCapacity = isOfferedCourseExists?.maxCapacity;
  if (maxCapacity <= 0) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'room is full');
  }
  // check if the students exists
  const isStudentExists = await Student.findOne({ id: userID }).select('_id');
  if (!isStudentExists) {
    throw new AppError(StatusCodes.BAD_GATEWAY, 'this student does not exists');
  }
  // check if the student already enrolled the same course
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semisterRegistration: isOfferedCourseExists?.semisterRegistration,
    offeredCourse,
    student: isStudentExists?._id,
  });
  if (isStudentAlreadyEnrolled) {
    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      'this student already enrolled'
    );
  }
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

  const result = await EnrolledCourse.create(payload);
  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'failed to crete enrolled course'
    );
  }

  return result;
};

export const enrolledCourseService = {
  createEnrolledCourse,
};
