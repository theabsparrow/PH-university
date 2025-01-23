import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.Model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFaculty = async (query: Record<string, unknown>) => {
  const academicFacultySearchableFields: string[] = ['name'];
  const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
    .search(academicFacultySearchableFields)
    .filter()
    .sort();

  const result = await academicFacultyQuery.modelQuery;
  const meta = await academicFacultyQuery.countTotal();
  return { meta, result };
};

const getSingleAcademicFaculty = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  if (!result) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This academy faculty does not exist'
    );
  }
  return result;
};

const updateAcademicFaculty = async (
  id: string,
  payload: Partial<TAcademicFaculty>
) => {
  const isAcademyFacultyExists = await AcademicFaculty.findById(id);
  if (!isAcademyFacultyExists) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this academy faculty does not exist'
    );
  }
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const academicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
