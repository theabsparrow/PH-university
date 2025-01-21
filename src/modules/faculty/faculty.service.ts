import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { Faculty } from './faculty.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { TFaculty } from './faculty.interface';
import { SearchableFields } from '../../global/constant';
import { uploadImage } from '../../utills/uploadImageToCloudinary';
/* eslint-disable @typescript-eslint/no-explicit-any */

const getAllFaculty = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find()
      .populate('user')
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
  const result = await facultyQuery.modelQuery;
  return result;
};

const getSingleFaculty = async (id: string) => {
  const result = await Faculty.findById(id)
    .populate('user')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  if (!result || result.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This faculty doesn`t exists');
  }
  const isFacultyBlocked = await User.findById(result?.user);
  if (!isFacultyBlocked || isFacultyBlocked?.status !== 'in-progress') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This faculty is blocked');
  }
  return result;
};

const deleteFaculty = async (id: string) => {
  const isFacultyExist = await Faculty.findById(id);
  if (!isFacultyExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This faculty doesn`t exists');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deleteFaculty) {
      throw new AppError(StatusCodes.BAD_REQUEST, ' faild to delete faculty');
    }
    const facultyID = isFacultyExist?.user;
    const deleteUser = await User.findByIdAndUpdate(
      facultyID,
      { isDeleted: true },
      { new: true }
    );
    if (!deleteUser) {
      throw new AppError(StatusCodes.BAD_REQUEST, ' faild to delete faculty');
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

const updateFaculty = async (
  id: string,
  payload: Partial<TFaculty>,
  file: any
) => {
  const isFacultyExist = await Faculty.findById(id);
  if (!isFacultyExist || isFacultyExist?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this faculty doesn`t exist');
  }

  const facultyID = isFacultyExist?.id;
  const isFacultyBlocked = await User.findOne({ id: facultyID });
  if (!isFacultyBlocked || isFacultyBlocked?.status !== 'in-progress') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This Faculty is blocked');
  }
  if (file) {
    const imageName = file?.originalname;
    const imagePath = file?.path;
    const imageURL = await uploadImage(imageName, imagePath);
    payload.profileImage = imageURL?.secure_url;
  }
  const { name, ...remainingStudent } = payload;
  const modifiedData: Record<string, unknown> = { ...remainingStudent };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedData[`name.${key}`] = value;
    }
  }
  const result = await Faculty.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const facultyService = {
  getAllFaculty,
  getSingleFaculty,
  deleteFaculty,
  updateFaculty,
};
