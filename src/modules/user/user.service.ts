import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { Tuser } from './user.interface';
import { User } from './user.model';

const createStudent = async (password: string, studentData: TStudent) => {
  const userData: Partial<Tuser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'student';
  userData.id = '2030100001';

  const user = await User.create(userData);
  if (Object.keys(user).length) {
    studentData.id = user.id;
    studentData.user = user._id;
  }

  const student = await Student.create(studentData);
  return { user, student };
};

export const userService = {
  createStudent,
};
