import { StatusCodes } from 'http-status-codes';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { SearchableFields } from '../../global/constant';
import { Admin } from './admin.model';
import { User } from '../user/user.model';
import mongoose from 'mongoose';
import { TAdmin } from './admin.interface';
import { uploadImage } from '../../utills/uploadImageToCloudinary';
/* eslint-disable @typescript-eslint/no-explicit-any */

const getAllAdmin = async (query: Record<string, unknown>) => {
  const AdminQuery = new QueryBuilder(Admin.find().populate('user'), query)
    .search(SearchableFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();
  const result = await AdminQuery.modelQuery;
  const meta = await AdminQuery.countTotal()
  return {meta,result};
};

const getSingleAdmin = async (id: string) => {
  const result = await Admin.findById(id).populate('user');
  if (!result || result.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This Admin doesn`t exists');
  }
  const isAdminBlocked = await User.findById(result?.user);
  if (!isAdminBlocked || isAdminBlocked?.status !== 'in-progress') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'This admin is blocked');
  }
  return result;
};

const deleteAdmin = async (id: string) => {
  const isAdminExist = await Admin.findById(id);
  if (!isAdminExist) {
    throw new AppError(StatusCodes.NOT_FOUND, 'This admin doesn`t exists');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deleteAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session }
    );
    if (!deleteAdmin) {
      throw new AppError(StatusCodes.BAD_REQUEST, ' faild to delete faculty');
    }
    const adminID = isAdminExist?.user;
    const deleteUser = await User.findByIdAndUpdate(
      adminID,
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

const updateAdmin = async (id: string, payload: Partial<TAdmin>, file: any) => {
  const isAdminExist = await Admin.findById(id);
  if (!isAdminExist || isAdminExist?.isDeleted) {
    throw new AppError(StatusCodes.NOT_FOUND, 'this faculty doesn`t exist');
  }

  const adminID = isAdminExist?.id;
  const isAdminBlocked = await User.findOne({ id: adminID });
  if (!isAdminBlocked || isAdminBlocked?.status !== 'in-progress') {
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
  const result = await Admin.findByIdAndUpdate(id, modifiedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

export const adminService = {
  getAllAdmin,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
