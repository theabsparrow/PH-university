import config from '../../config';
import { AcademicSemister } from '../academicSemister/academicSemister.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { Tuser } from './user.interface';
import { User } from './user.model';
import { generateStudentID } from './user.utills';

const createStudent = async (password: string, payload: TStudent) => {
  const userData: Partial<Tuser> = {};

  userData.password = password || (config.default_pass as string);
  userData.role = 'student';

  const admissionSemister = await AcademicSemister.findById(
    payload.admissionSemister
  );
  if (!admissionSemister) {
    throw new Error('Admission semister does not found');
  }

  userData.id = await generateStudentID(admissionSemister);

  const user = await User.create(userData);
  if (Object.keys(user).length) {
    payload.id = user.id;
    payload.user = user._id;
  }

  const student = await Student.create(payload);
  return { user, student };
};

export const userService = {
  createStudent,
};
