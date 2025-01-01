import config from '../../config';
import { TStudent } from '../student/student.interface';
import { Tuser } from './user.interface';
import { User } from './user.model';

const createStudent = async (password: string, studentData: TStudent) => {
  const user: Partial<Tuser> = {};
  user.password = password || (config.default_pass as string);
  user.role = 'student';
  user.id = '2030100001';
  const result = await User.create(user);
  if (Object.keys(result).length) {
    studentData.id = result.id;
    studentData.user = result._id;
  }
  return result;
};

export const userService = {
  createStudent,
};
