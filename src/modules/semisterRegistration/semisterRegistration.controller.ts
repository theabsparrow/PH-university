/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utills/catchAsync';
import { semisterRegistrationService } from './semisterRegistration.service';
import sendResponse from '../../utills/sendResponse';
import { StatusCodes } from 'http-status-codes';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

const createSemisterRegistration = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await semisterRegistrationService.createSemisterRegistrtion(
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'semister registered successfully',
      data: result,
    });
  }
);

const getAllRegisteredSemister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await semisterRegistrationService.getAllRegisteredSemister(
      query
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'all registered semisters are retrived successfully',
      data: result,
    });
  }
);

const getASingleRegisteredSemister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result =
      await semisterRegistrationService.getSingleRegisteredSemister(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'registered semister is retrived successfully',
      data: result,
    });
  }
);

const updateRegisteredSemister = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;
    const result = await semisterRegistrationService.updateRegisteredSemister(
      id,
      payload
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'registered semister is updated successfully',
      data: result,
    });
  }
);

export const semisterRegistrationController = {
  createSemisterRegistration,
  getAllRegisteredSemister,
  getASingleRegisteredSemister,
  updateRegisteredSemister,
};
