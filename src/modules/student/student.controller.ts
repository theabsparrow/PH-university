import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { studentService } from './student.service';
import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../utills/sendResponse';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const getAllStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await studentService.getAllStudent(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: result?.result.length ? 'students are retrived successfully' : 'no data found',
      meta: result?.meta,
      data: result?.result,
    });
  }
);

const getASingleStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await studentService.getSingleStudent(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'student is retrived successfully',
      data: result,
    });
  }
);

const deleteStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.studentID;
    const result = await studentService.deleteStudent(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'student is deleted successfully',
      data: result,
    });
  }
);

const updateStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body.student;
    const imageFile = req.file;
    const result = await studentService.updateStudent(id, payload, imageFile);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'student is updated successfully',
      data: result,
    });
  }
);

export const studentController = {
  getAllStudent,
  getASingleStudent,
  deleteStudent,
  updateStudent,
};
