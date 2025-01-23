/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { enrolledCourseService } from './enrolledCourse.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { Types } from 'mongoose';

const createEnrolledCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const { userID } = req.user;
    const result = await enrolledCourseService.createEnrolledCourse(
      payload,
      userID
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'enrolled course created successfully',
      data: result,
    });
  }
);

const getMyEnrolledCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { userID } = user;
    const query = req.query;
    const result = await enrolledCourseService.getMyEnrolledCourse(
      userID,
      query
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message:result?.result? 'my enrolled course retrived successfully': 'no data found',
      meta: result?.meta,
      data: result?.result,
    });
  }
);

const updateEnrolledCourseMarks = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const enrolledCourseID = req.enrolledCourseID as Types.ObjectId;
    const result = await enrolledCourseService.updateEnrolledCourseMarks(
      payload,
      enrolledCourseID
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'enrolled course marks updated successfully',
      data: result,
    });
  }
);
export const enrolledCourseController = {
  createEnrolledCourse,
  updateEnrolledCourseMarks,
  getMyEnrolledCourse,
};
