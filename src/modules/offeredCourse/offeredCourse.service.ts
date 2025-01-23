import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { SemisterRegistration } from '../semisterRegistration/semisterRegistration.model';
import {
  TOfferedCourse,
  TUpdateOfferedCourse,
} from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utills';
import { registrationStatus } from '../semisterRegistration/semisterRegistration.constant';
import QueryBuilder from '../../builder/QueryBuilder';
import { Student } from '../student/student.model';

// create offered course
const createOfferedCourse = async (payload: TOfferedCourse) => {
  const {
    semisterRegistration,
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
  } else if (
    isSemisterRegistrationExists?.status !== registrationStatus.UPCOMING
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `this semister is ${isSemisterRegistrationExists?.status}. so you can't offer it`
    );
  }
  const academicSemister = isSemisterRegistrationExists?.academicSemister;
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
  const academicFaculty = isAcademicDepartmentExists?.academicFaculty;
  payload.academicFaculty = academicFaculty;
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

// get all offered course
const getAllOfferedCourse = async (query: Record<string, unknown>) => {
  const allOfferedCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await allOfferedCourseQuery.modelQuery;
  const meta = await allOfferedCourseQuery.countTotal();
  return {meta,result};
};

const getMyOfferedCourse = async (
  id: string,
  query: Record<string, unknown>
) => {
  // check if the student exists
  const isStudentExists = await Student.findOne({ id: id });
  if (!isStudentExists) {
    throw new AppError(StatusCodes.NOT_FOUND, ' student not found');
  }
  // get the current ongoing semister
  const currentOngoingRegisterSemister = await SemisterRegistration.findOne({
    status: 'ONGOING',
  });
  if (!currentOngoingRegisterSemister) {
    throw new AppError(StatusCodes.NOT_FOUND, 'No ongoing semister right now');
  }
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const aggrigateQuery = [
    {
      $match: {
        semisterRegistration: currentOngoingRegisterSemister?._id,
        academicFaculty: isStudentExists?.academicFaculty,
        academicDepartment: isStudentExists?.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingRegisterSemister: currentOngoingRegisterSemister._id,
          currentStudentID: isStudentExists._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semisterRegistration',
                      '$$currentOngoingRegisterSemister',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudentID'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: isStudentExists._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIDs: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisiteFulfiled: {
          $or: [
            {
              $eq: ['$course.preRequisite', []],
            },
            {
              $setIsSubset: [
                '$course.preRequisite.course',
                '$completedCourseIDs',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisiteFulfiled: true,
      },
    },
  ];
  const paginateQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
  const result = await OfferedCourse.aggregate([...aggrigateQuery, ...paginateQuery]);
  const total = (await OfferedCourse.aggregate(aggrigateQuery)).length

  const totalPage = Math.ceil(total / limit);
  return {
    meta: {
      page,
      limit,
      total,
      totalPage
    },
    result
  };
};

// get a single offered course
const getASingleOfferedCourse = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no offered course found');
  }
  return isOfferedCourseExists;
};

// update a offered course
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

// delete a offered course
const deleteOfferedCourse = async (id: string) => {
  // check if the offered course is exist
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'no offered course found');
  }

  // check if the semister registration is upcoming
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
      `this semister status is ${semisterRegistrationStatus.status}. so you can't delete it`
    );
  }

  // final result
  const result = await OfferedCourse.findByIdAndDelete(id);
  return result;
};
export const offeredCourseService = {
  createOfferedCourse,
  getAllOfferedCourse,
  getASingleOfferedCourse,
  updatedOfferCourse,
  deleteOfferedCourse,
  getMyOfferedCourse,
};
