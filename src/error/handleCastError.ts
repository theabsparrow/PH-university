import mongoose from 'mongoose';
import { TErrorSource, TValidationError } from '../interface/error';
import { StatusCodes } from 'http-status-codes';

const handleCastError = (err: mongoose.Error.CastError): TValidationError => {
  const errorSources: TErrorSource = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];
  const statusCode = StatusCodes.BAD_REQUEST;
  return {
    statusCode,
    message: 'Invalid ID',
    errorSources,
  };
};
export default handleCastError;
