/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { Tuser } from './user.interface';
import { User } from './user.model';
import {
  genearteAdminID,
  generateFacultyID,
  generateStudentID,
} from './user.utills';
import mongoose from 'mongoose';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Faculty } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

const createStudent = async (password: string, payload: TStudent) => {
  const userData: Partial<Tuser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'student';

  const admissionSemister = await AcademicSemister.findById(
    payload.admissionSemister
  );
  if (!admissionSemister) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Admission semister does not found'
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    userData.id = await generateStudentID(admissionSemister);

    const user = await User.create([userData], { session });
    if (!user.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'user creation faild');
    }

    payload.id = user[0].id;
    payload.user = user[0]._id;
    const student = await Student.create([payload], { session });
    if (!student) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'student creation faild');
    }
    await session.commitTransaction();
    await session.endSession();

    return student;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

const createFAculty = async (password: string, payload: TFaculty) => {
  const userData: Partial<Tuser> = {};
  userData.password = password || config.default_pass;
  userData.role = 'faculty';
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    payload?.academicDepartment
  );
  if (!isAcademicDepartmentExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Academic department not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await generateFacultyID();
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to create user');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFAculty = await Faculty.create([payload], { session });
    if (!newFAculty.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to create students');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFAculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

const createAdmin = async (password: string, payload: TAdmin) => {
  const userData: Partial<Tuser> = {};
  userData.password = password;
  userData.role = 'admin';

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    userData.id = await genearteAdminID();
    const newUser = await User.create([userData], { session });
    if (!newUser.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to create user');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'faild to create students');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST, err);
  }
};

export const userService = {
  createStudent,
  createFAculty,
  createAdmin,
};
