import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { academicSemisterServie } from './academicSemister.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const createAcademicSemister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await academicSemisterServie.createAcademicSemister(payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'academic semister is created successfully',
      data: result,
    });
  }
);

const getAllAcademicSemister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await academicSemisterServie.getAllAcademySemister();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'All academic semisters are retrived successfully',
      data: result || 'no data found',
    });
  }
);

const getASingleAcademicSemister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await academicSemisterServie.getASingleAcademySemister(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: ' Academic semister is retrived successfully',
      data: result,
    });
  }
);

const updateAcademicSemister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await academicSemisterServie.updateAcademicSemister(
      payload,
      id
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: ' Academic semister is updated successfully',
      data: result,
    });
  }
);

export const academicSemisterController = {
  createAcademicSemister,
  getAllAcademicSemister,
  getASingleAcademicSemister,
  updateAcademicSemister,
};
