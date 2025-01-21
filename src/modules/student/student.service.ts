/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import AppError from '../../error/AppError';
import { Student } from './student.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { SearchableFields } from '../../global/constant';
import { uploadImage } from '../../utills/uploadImageToCloudinary';

const getAllStudent = async (query: Record<string, unknown>) => {
  // const queryObject = { ...query };
  // const excludeFields = [
  //   'searchTerm',
  //   'sort',
  //   'sortOrder',
  //   'limit',
  //   'page',
  //   'fields',
  // ];
  // excludeFields.forEach((element) => delete queryObject[element]);

  // let searchTerm = '';
  // let sort = '-createdAt';
  // let limit = 0;
  // let page = 1;
  // let skip = 0;
  // let fields = '-_v';

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQUery = Student.find({
  //   $or: studentSearchAbleFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // const filterQuery = searchQUery.find(queryObject);
  // .populate('user')
  // .populate('admissionSemister')
  // .populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty',
  //   },
  // });

  // if (query?.sort) {
  //   const sortOrder = query?.sortOrder === 'desc' ? '-' : '';
  //   const sortBy = query?.sort as string;
  //   sort = `${sortOrder}${sortBy}`;
  // }
  // const sortQuery = filterQuery.sort(sort);

  // if (query?.limit) {
  //   limit = Number(query?.limit);
  // }
  // if (query?.page) {
  //   page = Number(query?.page);
  //   skip = (page - 1) * limit;
  // }
  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery = paginateQuery.limit(limit);

  // if (query?.fields) {
  //   fields = (query?.fields as string).split(',').join(' ');
  // }
  // const fieldQuery = await limitQuery.select(fields);

  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('admissionSemister')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query
  )
    .search(SearchableFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();

  const result = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return { meta, result };
};

const getSingleStudent = async (id: string) => {
  const result = await Student.findOne({ id })
    .populate('user')
    .populate('admissionSemister')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  if (!result || result?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This student doesn`t exists');
  }

  const isStudentBlocked = await User.findOne({ id });
  if (!isStudentBlocked || isStudentBlocked?.status !== 'in-progress') {
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
    return null;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

const updateStudent = async (
  id: string,
  payload: Partial<TStudent>,
  file: any
) => {
  const isStudentExist = await Student.findOne({ id });
  if (!isStudentExist || isStudentExist?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this student doesn`t exist');
  }
  const isStudentBlocked = await User.findOne({ id });
  if (!isStudentBlocked || isStudentBlocked?.status !== 'in-progress') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This student is blocked');
  }
  if (file) {
    const imageName = file?.originalname;
    const imagePath = file?.path;
    const imageURL = await uploadImage(imageName, imagePath);
    payload.profileImage = imageURL?.secure_url;
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
