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

const getAllOfferedCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await offeredCourseService.getAllOfferedCourse(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: result?.result.length
        ? 'offered coursees are retrived successfully'
        : 'no data found',
      meta: result?.meta,
      data: result?.result,
    });
  }
);

const getSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await offeredCourseService.getASingleOfferedCourse(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'offered course is retrived successfully',
      data: result,
    });
  }
);

const getMyOfferedCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const query = req.query;
    const { userID } = user;
    const result = await offeredCourseService.getMyOfferedCourse(userID, query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: result?.result.length
        ? 'my offered courses are retrived successfully'
        : 'no data found',
      meta: result?.meta,
      data: result?.result,
    });
  }
);

const updateOfferedCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await offeredCourseService.updatedOfferCourse(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'offered course updated successfully',
      data: result,
    });
  }
);

const deleteOfferedCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await offeredCourseService.deleteOfferedCourse(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'offered course deleted successfully',
      data: result,
    });
  }
);
export const offeredCourseController = {
  createOfferedCourse,
  getAllOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourse,
  getSingleOfferedCourse,
  getMyOfferedCourse,
};
