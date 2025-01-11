import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { offeredCourseService } from './offeredCourse.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const createOfferedCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await offeredCourseService.createOfferedCourse(payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'offered course created successfully',
      data: result,
    });
  }
);

export const offeredCourseController = {
  createOfferedCourse,
};
