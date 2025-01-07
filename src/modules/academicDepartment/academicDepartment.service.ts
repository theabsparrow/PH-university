import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicDepartment = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartment = async (query: Record<string, unknown>) => {
  const academicDepartmentSearchableFields: string[] = ['name'];
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find().populate('academicFaculty'),
    query
  )
    .search(academicDepartmentSearchableFields)
    .filter()
    .sort()
    .fields();

  const result = await academicDepartmentQuery.modelQuery;
  return result;
};

const getSingleAcademicDepartment = async (id: string) => {
  const result = await AcademicDepartment.findById(id).populate(
    'academicFaculty'
  );
  if (!result) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'This Academic Department does not exist'
    );
  }
  return result;
};

const updateAcademicDepartment = async (
  id: string,
  payload: Partial<TAcademicDepartment>
) => {
  const isAcademicDepartmentExist = await AcademicDepartment.findById(id);
  if (!isAcademicDepartmentExist) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'this academic department does not exist'
    );
  }
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    }
  );
  return result;
};

export const academicDepartmentService = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
