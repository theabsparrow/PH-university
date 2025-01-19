/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { Faculty } from '../modules/faculty/faculty.model';
import AppError from '../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { EnrolledCourse } from '../modules/enrolledCourse/enrolledCourse.model';
import catchAsync from '../utills/catchAsync';
import { Types } from 'mongoose';

export const matchEnrolledCourseFaculty = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userID } = req.user;
    const { semisterRegistration, offeredCourse, student } = req.body;
    try {
      const facultyID = await Faculty.findOne({ id: userID }).select('_id');
      if (!facultyID) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          'you are not authorized to update the marks'
        );
      }
      const faculty = facultyID?._id;
      const isCourseBelongToFaculty = await EnrolledCourse.findOne({
        semisterRegistration,
        offeredCourse,
        student,
        faculty,
      });
      if (!isCourseBelongToFaculty) {
        throw new AppError(
          StatusCodes.FORBIDDEN,
          'you are not authorized to update the marks'
        );
      }
      req.enrolledCourseID = isCourseBelongToFaculty._id as Types.ObjectId;
      next();
    } catch (err: any) {
      throw new Error(err);
    }
  });
};
