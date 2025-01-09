import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { adminService } from './admin.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const getAllAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await adminService.getAllAdmin(query);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admins retrived successfully',
      data: result,
    });
  }
);

const getSingleAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminService.getSingleAdmin(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'admin is retrived successfully',
      data: result,
    });
  }
);

const updateAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body.admin;
    const result = await adminService.updateAdmin(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Admin updated successfully',
      data: result,
    });
  }
);

const deleteAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await adminService.deleteAdmin(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'admin deleted successfully',
      data: result,
    });
  }
);

export const adminController = {
  getAllAdmin,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
