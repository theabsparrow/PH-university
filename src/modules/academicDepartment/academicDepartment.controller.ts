import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { academicDepartmentService } from './academicDepartment.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const createAcademicDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await academicDepartmentService.createAcademicDepartment(
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Academic department created successfully',
      data: result,
    });
  }
);

const getAllAcademicDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await academicDepartmentService.getAllAcademicDepartment(
      query
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Academic Departments retrived successfully',
      data: result || 'no data found',
    });
  }
);

const getSingleAcademicDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await academicDepartmentService.getSingleAcademicDepartment(
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Academic department retrived successfully',
      data: result,
    });
  }
);

const updateAcademicDepartment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await academicDepartmentService.updateAcademicDepartment(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Academic department updated successfully',
      data: result,
    });
  }
);
export const academicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
