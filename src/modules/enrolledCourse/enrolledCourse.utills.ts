import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { Types } from 'mongoose';
import { TGradePoints } from './enrolledCourse.interface';

export const getOfferCourse = async (id: Types.ObjectId) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);
  if (!isOfferedCourseExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this offer course does not exists'
    );
  }
  return isOfferedCourseExists;
};

export const calculateGradeAndPoints = (totalMarks: number) => {
  let gradePoints: TGradePoints = {
    grade: 'NA',
    gradePoints: 0,
  };
  if (totalMarks >= 0 && totalMarks <= 19) {
    gradePoints = {
      grade: 'F',
      gradePoints: 0.0,
    };
  } else if (totalMarks >= 20 && totalMarks <= 39) {
    gradePoints = {
      grade: 'D',
      gradePoints: 2.0,
    };
  } else if (totalMarks >= 40 && totalMarks <= 59) {
    gradePoints = {
      grade: 'C',
      gradePoints: 3.0,
    };
  } else if (totalMarks >= 60 && totalMarks <= 79) {
    gradePoints = {
      grade: 'B',
      gradePoints: 3.5,
    };
  } else if (totalMarks >= 80 && totalMarks <= 100) {
    gradePoints = {
      grade: 'A',
      gradePoints: 4,
    };
  } else {
    gradePoints = {
      grade: 'NA',
      gradePoints: 0,
    };
  }
  return gradePoints;
};
