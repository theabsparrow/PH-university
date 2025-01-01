import { NextFunction, Request, Response } from 'express';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 500;
  const message = err.message || 'something went wrong';
  res.status(statusCode).json({
    success: false,
    statusCode: statusCode,
    message,
    error: err,
  });
};

export default globalErrorHandler;
