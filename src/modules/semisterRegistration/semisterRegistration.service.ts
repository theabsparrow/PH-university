/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { TSemisterRegistration } from './semisterRegistration.interface';
import { SemisterRegistration } from './semisterRegistration.model';
import { registrationStatus } from './semisterRegistration.constant';
import mongoose from 'mongoose';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';

const createSemisterRegistrtion = async (payload: TSemisterRegistration) => {
  const IsAnyUpcomingOrOngoingSemister = await SemisterRegistration.findOne({
    $or: [
      { status: registrationStatus.UPCOMING },
      { status: registrationStatus.ONGOING },
    ],
  });
  if (IsAnyUpcomingOrOngoingSemister) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `there is already an ${IsAnyUpcomingOrOngoingSemister?.status} registered semister`
    );
  }
  const result = await SemisterRegistration.create(payload);
  return result;
};

const getAllRegisteredSemister = async (query: Record<string, unknown>) => {
  const semisterRegistrtionQuery = new QueryBuilder(
    SemisterRegistration.find().populate('academicSemister'),
    query
  )
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await semisterRegistrtionQuery.modelQuery;
  const meta = await semisterRegistrtionQuery.countTotal();
  return { meta, result };
};

const getSingleRegisteredSemister = async (id: string) => {
  const isregisteredSemisteredExists = await SemisterRegistration.findById(
    id
  ).populate('academicSemister');
  if (!isregisteredSemisteredExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this semister is not registered yet'
    );
  }
  return isregisteredSemisteredExists;
};

// update semister registration
const updateRegisteredSemister = async (
  id: string,
  payload: Partial<TSemisterRegistration>
) => {
  // check if the registered semister is exists
  const isregisteredSemisteredExists = await SemisterRegistration.findById(id);
  if (!isregisteredSemisteredExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this semister is not registered yet'
    );
  }

  // check if the semister is endede
  if (
    isregisteredSemisteredExists &&
    isregisteredSemisteredExists.status === registrationStatus.ENDED
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `this semister is already ${isregisteredSemisteredExists.status}`
    );
  }

  // check if the semister status is not conflicting
  const requestedStatus = payload?.status;
  const currentStatus = isregisteredSemisteredExists?.status;
  if (
    (currentStatus === registrationStatus.UPCOMING &&
      requestedStatus === registrationStatus.ENDED) ||
    (currentStatus === registrationStatus.ONGOING &&
      requestedStatus === registrationStatus.UPCOMING)
  ) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `you can't derectly update status from ${currentStatus} to ${requestedStatus}`
    );
  }

  // update semister registration
  const result = await SemisterRegistration.findOneAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true }
  );
  return result;
};

// delete semister registration
const deleteSemisterRegistration = async (id: string) => {
  // check if the registered semister is exists
  const isregisteredSemisteredExists = await SemisterRegistration.findById(id);
  if (!isregisteredSemisteredExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this semister is not registered yet'
    );
  }

  // check if the semister is upcoming or not
  const semisterRegistrationStatus = isregisteredSemisteredExists?.status;
  if (semisterRegistrationStatus !== registrationStatus.UPCOMING) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `this semister is ${semisterRegistrationStatus}, so you can't update it`
    );
  }

  // start transactiona nd rollback
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteOfferedCoursewithThisSemisterRegistration =
      await OfferedCourse.deleteMany(
        {
          semisterRegistration: id,
        },
        {
          new: true,
          session,
        }
      );
    if (!deleteOfferedCoursewithThisSemisterRegistration) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `faild to delete semister registration`
      );
    }

    const deleteSemisterRegistration =
      await SemisterRegistration.findByIdAndDelete(id, { new: true, session });
    if (!deleteSemisterRegistration) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `faild to delete semister registration`
      );
    }

    await session.commitTransaction();
    await session.endSession();
    // transaction rollback ends
    return null;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};
export const semisterRegistrationService = {
  createSemisterRegistrtion,
  getAllRegisteredSemister,
  getSingleRegisteredSemister,
  updateRegisteredSemister,
  deleteSemisterRegistration,
};
