import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import {
  academicSemisterNameCodeStructure,
  academicSemisterSearchableFields,
} from './academicSemister.constant';
import { TAcademicSemister } from './academicSemister.interface';
import { AcademicSemister } from './academicSemister.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicSemister = async (payload: TAcademicSemister) => {
  if (academicSemisterNameCodeStructure[payload.name] !== payload.code) {
    throw new Error('Invalid semister code');
  }
  const result = await AcademicSemister.create(payload);
  return result;
};

const getAllAcademySemister = async (query: Record<string, unknown>) => {
  const academicSemisterQuery = new QueryBuilder(AcademicSemister.find(), query)
    .search(academicSemisterSearchableFields)
    .filter()
    .sort()
    .fields();
  const result = await academicSemisterQuery.modelQuery;
  return result;
};

const getASingleAcademySemister = async (id: string) => {
  const result = await AcademicSemister.findById(id);
  if (!result) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this academic semister does not exist'
    );
  }
  return result;
};

const updateAcademicSemister = async (
  payload: Partial<TAcademicSemister>,
  id: string
) => {
  if (
    payload?.name &&
    payload?.code &&
    academicSemisterNameCodeStructure[payload.name] !== payload.code
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid semister code');
  }

  const isSemisterExist = await AcademicSemister.findById(id);
  if (!isSemisterExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this semister does not exist');
  }

  const { name, year } = payload;
  const query: Record<string, unknown> = {};

  if (name && year) {
    query.year = year;
    query.name = name;
  } else if (name) {
    query.name = name;
    query.year = isSemisterExist?.year;
  } else if (year) {
    query.name = isSemisterExist?.name;
    query.year = year;
  }

  if (Object.keys(query).length) {
    const existingSemister = await AcademicSemister.findOne(query);
    if (existingSemister) {
      throw new AppError(StatusCodes.CONFLICT, 'This semister already exists');
    }
  }

  // if (year && name) {
  //   const isSemisterExist = await AcademicSemister.findOne({ year, name });
  //   if (isSemisterExist) {
  //     throw new Error('this semister is already exists');
  //   }
  // } else if (name) {
  //   const isSemisterNameExist = await AcademicSemister.findOne({
  //     year: isSemisterExist?.year,
  //     name: name,
  //   });
  //   if (isSemisterNameExist) {
  //     throw new Error('this semister is already exists');
  //   }
  // } else if (year) {
  //   const isSemisterNameExist = await AcademicSemister.findOne({
  //     year: year,
  //     name: isSemisterExist?.name,
  //   });
  //   if (isSemisterNameExist) {
  //     throw new Error('this semister is already exists');
  //   }
  // }

  const result = await AcademicSemister.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const academicSemisterServie = {
  createAcademicSemister,
  getAllAcademySemister,
  getASingleAcademySemister,
  updateAcademicSemister,
};
