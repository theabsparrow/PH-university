import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { academicFacultyService } from './academicFaulty.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const createAcademicFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await academicFacultyService.createAcademicFaculty(payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Academic faculty created successfully',
      data: result,
    });
  }
);

const getAllAcademicFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await academicFacultyService.getAllAcademicFaculty(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: result?.result
        ? 'Academic faculties are retrived successfully'
        : 'no data found',
      meta: result?.meta,
      data: result?.result,
    });
  }
);

const getASingleAcademicFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await academicFacultyService.getSingleAcademicFaculty(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Academic facultie retrived successfully',
      data: result,
    });
  }
);

const updateAcademicFaculty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await academicFacultyService.updateAcademicFaculty(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Academic facultie updated successfully',
      data: result,
    });
  }
);
export const academicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getASingleAcademicFaculty,
  updateAcademicFaculty,
};
