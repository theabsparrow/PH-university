import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { Course } from '../course/course.model';
import { TCourseFaculty } from './courseFaculty.interface';
import { CourseFaculty } from './courseFaculty.model';
import { Faculty } from '../faculty/faculty.model';

const assignFacultiesIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  const isCourseExist = await Course.findById(id);
  if (!isCourseExist || isCourseExist.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this course does not exist');
  }

  if (payload?.faculties && payload?.faculties.length > 0) {
    const { faculties } = payload;
    for (const faculty of faculties) {
      const isFacultyExist = await Faculty.findById(faculty);
      if (!isFacultyExist) {
        throw new AppError(
          StatusCodes.NOT_FOUND,
          'the faculties you tried to assign do not exist'
        );
      }
    }
  }

  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload.faculties } },
    },
    {
      upsert: true,
      new: true,
    }
  );
  return result;
};

const removeFaculties = async (
  id: string,
  payload: Partial<TCourseFaculty>
) => {
  // check if the targeted course faculty is exist
  const isCourseFAcultyExist = await CourseFaculty.findById(id);
  if (!isCourseFAcultyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'data not found');
  }

  // check if the faculty length comes from body is not larger than the faculty length in the database
  if (
    payload?.faculties &&
    isCourseFAcultyExist.faculties.length < payload?.faculties?.length
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'operation failed');
  }

  // chech if the faculty element comes from he body is included in the faculty in the database
  const isInclude = payload.faculties?.every((element) =>
    isCourseFAcultyExist.faculties.includes(element)
  );
  if (!isInclude) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      'the faculty you want to remove isn`t included in the course yet'
    );
  }

  // final result
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload.faculties } },
    },
    {
      new: true,
    }
  );
  return result;
};

export const courseFacultyService = {
  assignFacultiesIntoDB,
  removeFaculties,
};
