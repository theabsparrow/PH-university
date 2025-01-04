import { StatusCodes } from 'http-status-codes';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { Tuser } from './user.interface';
import { User } from './user.model';
import { generateStudentID } from './user.utills';
import mongoose from 'mongoose';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('faild to create student');
  }
};

export const userService = {
  createStudent,
};
