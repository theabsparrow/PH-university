/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { courseService } from './course.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await courseService.createCourse(payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Course created successfully',
      data: result,
    });
  }
);

const getAllCourses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await courseService.getAllCourse(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'courses are retrived successfully',
      data: result,
    });
  }
);

const getASingleCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await courseService.getASingleCourse(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'course is retrived successfully',
      data: result,
    });
  }
);

const updateACourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await courseService.updateACourse(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'course is updated successfully',
      data: result,
    });
  }
);

const deleteACourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await courseService.deleteACourse(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'course is deleted successfully',
      data: result,
    });
  }
);

export const courseColtroller = {
  createCourse,
  getAllCourses,
  getASingleCourse,
  updateACourse,
  deleteACourse,
};
