import { TAcademicSemister } from '../academicSemister/academicSemister.interface';
import { User } from './user.model';

const findLastStudentID = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    }
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastStudent?.id ? lastStudent.id.substring(6) : undefined;
};

export const generateStudentID = async (payload: TAcademicSemister) => {
  const presentID = (await findLastStudentID()) || (0).toString();
  let incrementID = (Number(presentID) + 1).toString().padStart(4, '0');
  incrementID = `${payload.year}${payload.code}${incrementID}`;
  return incrementID;
};
