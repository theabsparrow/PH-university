/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { courseFacultyService } from './courseFaculty.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';

const assignFacultiesIntoDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.courseID;
    const payload = req.body;
    const result = await courseFacultyService.assignFacultiesIntoDB(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'faculties assigned successfully',
      data: result,
    });
  }
);

const removeFaculties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.courseID;
    const payload = req.body;
    const result = await courseFacultyService.removeFaculties(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'faculties successfully',
      data: result,
    });
  }
);

export const courseFAcultyController = {
  assignFacultiesIntoDB,
  removeFaculties,
};
