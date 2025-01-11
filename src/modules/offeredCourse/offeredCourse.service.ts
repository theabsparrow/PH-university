import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { SemisterRegistration } from '../semisterRegistration/semisterRegistration.model';
import {
  TOfferedCourse,
  TUpdateOfferedCourse,
} from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.Model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utills';
import { registrationStatus } from '../semisterRegistration/semisterRegistration.constant';

const createOfferedCourse = async (payload: TOfferedCourse) => {
  const {
    semisterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  //   check if the semister is registered
  const isSemisterRegistrationExists = await SemisterRegistration.findById(
    semisterRegistration
  );
  if (!isSemisterRegistrationExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this semister is not registered yet'
    );
  }
  const academicSemister = isSemisterRegistrationExists?.academicSemister;

  //   check if the academic faculty is exist
  const isAcademicFacultyExists = await AcademicFaculty.findById(
    academicFaculty
  );
  if (!isAcademicFacultyExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this academic faculty is not found'
    );
  }

  //   check if the academic department is exist
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    academicDepartment
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this academic department is not found'
    );
  }

  //   check if the course is exist
  const isCourseExists = await Course.findById(course);
  if (!isCourseExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this course is not found');
  }

  //   check if the faculty is exist
  const isfacultyExists = await Faculty.findById(faculty);
  if (!isfacultyExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this faculty is not found');
  }

  // check if the academic department exists in the academic faculty
  const isDepartmentBelongToTheFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });
  if (!isDepartmentBelongToTheFaculty) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      `the ${isAcademicDepartmentExists.name} is not belong to the ${isAcademicFacultyExists.name}`
    );
  }

  // check if the faculty schedule is assigned before
  const assignedFacultySchedule = await OfferedCourse.find({
    semisterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  const timeConflict = hasTimeConflict(assignedFacultySchedule, newSchedule);
  if (timeConflict) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'the faculty is not available at this time'
    );
  }

  // final result
  const result = await OfferedCourse.create({ ...payload, academicSemister });
  return result;
};

const updatedOfferCourse = async (
  id: string,
  payload: TUpdateOfferedCourse
) => {
  const { faculty, days, startTime, endTime } = payload;

  // check if the offer course exists
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no offered course found');
  }

  // check if the faculty exists
  const isFacultyExists = await Faculty.findById(faculty);
  if (!isFacultyExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no faculty found');
  }

  // check if the semister registration is upcoming or not
  const semisterRegistration = isOfferedCourseExists.semisterRegistration;
  const semisterRegistrationStatus = await SemisterRegistration.findById(
    semisterRegistration
  ).select('status');
  if (
    semisterRegistrationStatus &&
    semisterRegistrationStatus?.status !== registrationStatus.UPCOMING
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `this semister status is ${semisterRegistrationStatus.status}. so you can update it`
    );
  }

  // check if the time conflicts with the faculty scheduled
  const assignedScheduled = await OfferedCourse.find({
    semisterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  const timeConflict = hasTimeConflict(assignedScheduled, newSchedule);
  if (timeConflict) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'the faculty is not available at this time'
    );
  }

  const result = await OfferedCourse.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const offeredCourseService = {
  createOfferedCourse,
  updatedOfferCourse,
};
