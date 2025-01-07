import { TAcademicSemister } from '../academicSemister/academicSemister.interface';
import { User } from './user.model';

// find last students with specific semister from db
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

// generate student id
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

// find last faculty id from db
const findLastFacultyId = async () => {
  const lastFacultyID = await User.findOne(
    {
      role: 'faculty',
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
  return lastFacultyID?._id ? lastFacultyID?.id : undefined;
};
// generate faculty ID
export const generateFacultyID = async () => {
  let currentID = (0).toString();
  const lastFacultyID = await findLastFacultyId();
  if (lastFacultyID) {
    currentID = lastFacultyID.substring(2);
  }
  let increment = (Number(currentID) + 1).toString().padStart(4, '0');
  increment = `F-${increment} `;
  return increment;
};

// find last Admin id from db
const findLastAdminID = async () => {
  const lastAdminID = await User.findOne(
    {
      role: 'admin',
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
  return lastAdminID?.id ? lastAdminID?.id : undefined;
};
// generate admin id
export const genearteAdminID = async () => {
  let currentID = (0).toString();
  const lastAdminID = await findLastAdminID();
  if (lastAdminID) {
    currentID = lastAdminID.substring(2);
  }
  let increment = (Number(currentID) + 1).toString().padStart(4, '0');
  increment = `A-${increment}`;
  return increment;
};
