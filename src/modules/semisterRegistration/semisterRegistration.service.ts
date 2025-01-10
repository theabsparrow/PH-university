import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { TSemisterRegistration } from './semisterRegistration.interface';
import { SemisterRegistration } from './semisterRegistration.model';
import { AcademicSemister } from '../academicSemister/academicSemister.model';

const createSemisterRegistrtion = async (payload: TSemisterRegistration) => {
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
  return result;
};

const getSingleRegisteredSemister = async (id: string) => {
  const isregisteredSemisteredExists = await SemisterRegistration.findById(id);
  if (!isregisteredSemisteredExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this semister is not registered yet'
    );
  }
  return isregisteredSemisteredExists;
};

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

  //   check if the academic semister comes from body is exists
  const academicSemister = payload?.academicSemister;
  if (academicSemister) {
    const isAcademicSemisterExists = await AcademicSemister.findById(
      academicSemister
    );
    if (!isAcademicSemisterExists) {
      throw new AppError(
        StatusCodes.NOT_FOUND,
        'the academic semister you provided doesnot exist'
      );
    }
  }

  //   check if the academic semister is already registered
  const isSemisterAlreadyExists = await SemisterRegistration.findOne({
    academicSemister,
  });
  if (isSemisterAlreadyExists) {
    throw new AppError(
      StatusCodes.CONFLICT,
      'the academic semister you provided is already registered'
    );
  }
};

export const semisterRegistrationService = {
  createSemisterRegistrtion,
  getAllRegisteredSemister,
  getSingleRegisteredSemister,
  updateRegisteredSemister,
};
