/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { Student } from './student.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import { studentSearchAbleFields } from './student.constant';

const getAllStudent = async (query: Record<string, unknown>) => {
  const queryObject = { ...query };
  let searchTerm = '';
  if (query?.searchTerm) {
    searchTerm = query?.searchTerm as string;
  }

  const searchQUery = Student.find({
    $or: studentSearchAbleFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  });

  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  excludeFields.forEach((element) => delete queryObject[element]);

  const filterQuery = searchQUery.find(queryObject);
  // .populate('user')
  // .populate('admissionSemister')
  // .populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty',
  //   },
  // });

  let sort = '-createdAt';
  if (query?.sort) {
    sort = query?.sort as string;
  }
  const sortQuery = filterQuery.sort(sort);

  let limit = 0;
  let page = 1;
  let skip = 0;
  if (query?.limit) {
    limit = Number(query?.limit);
  }
  if (query?.page) {
    page = Number(query?.page);
    skip = (page - 1) * limit;
  }
  const paginateQuery = sortQuery.skip(skip);
  const limitQuery = paginateQuery.limit(limit);

  let fields = '-_v';
  if (query?.fields) {
    fields = (query?.fields as string).split(',').join(' ');
  }
  const fieldQuery = await limitQuery.select(fields);
  return fieldQuery;
};

const getSingleStudent = async (id: string) => {
  const result = await Student.findById(id)
    .populate('user')
    .populate('admissionSemister')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  if (!result) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This student doesn`t exists');
  }
  if (result.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This student is blocked');
  }
  return result;
};

const deleteStudent = async (id: string) => {
  const isStudentExists = await Student.findOne({ id });
  if (!isStudentExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This student doesn`t exists');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!deletedStudent) {
      throw new AppError(StatusCodes.BAD_REQUEST, ' faild to delete student');
    }

    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to delete user');
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const updateStudent = async (id: string, payload: Partial<TStudent>) => {
  const isStudentExist = await Student.findOne({ id });
  if (!isStudentExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this student doesn`t exist');
  }
  if (isStudentExist.isDeleted) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'this student is blocked');
  }

  const { name, guardian, localGuardian, ...remainingStudent } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingStudent };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate({ id }, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const studentService = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
