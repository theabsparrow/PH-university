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

export const academicSemisterController = {
  createAcademicSemister,
};
