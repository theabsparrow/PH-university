import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { facultyService } from './faculty.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const getAllFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await facultyService.getAllFaculty(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Faculties retrived successfully',
      data: result,
    });
  }
);

const getSingleFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await facultyService.getSingleFaculty(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'student is retrived successfully',
      data: result,
    });
  }
);

const updateFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body.faculty;
    const result = await facultyService.updateFaculty(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'faculty updated successfully',
      data: result,
    });
  }
);

const deleteFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await facultyService.deleteFaculty(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'faculty deleted successfully',
      data: result,
    });
  }
);
export const facultyController = {
  getAllFaculty,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
