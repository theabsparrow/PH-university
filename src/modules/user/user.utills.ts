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
  return lastStudent?.id ? lastStudent?.id : undefined;
};

export const generateStudentID = async (payload: TAcademicSemister) => {
  let presentID = (0).toString();
  const lastStudentID = await findLastStudentID();
  const lastStudentSemisterCode = lastStudentID?.substring(4, 6);
  const lastStudentYear = lastStudentID?.substring(0, 4);
  const currentStudentSemisterCode = payload.code;
  const currentStudentYear = payload.year;

  if (
    lastStudentID &&
    lastStudentSemisterCode === currentStudentSemisterCode &&
    lastStudentYear &&
    currentStudentYear
  ) {
    presentID = lastStudentID?.substring(6);
  }
  let incrementID = (Number(presentID) + 1).toString().padStart(4, '0');
  incrementID = `${payload.year}${payload.code}${incrementID}`;
  return incrementID;
};
