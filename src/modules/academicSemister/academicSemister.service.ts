import { academicSemisterNameCodeStructure } from './academicSemister.constant';
import { TAcademicSemister } from './academicSemister.interface';
import { AcademicSemister } from './academicSemister.model';

const createAcademicSemister = async (payload: TAcademicSemister) => {
  if (academicSemisterNameCodeStructure[payload.name] !== payload.code) {
    throw new Error('Invalid semister code');
  }
  const result = await AcademicSemister.create(payload);
  return result;
};

const getAllAcademySemister = async () => {
  const result = await AcademicSemister.find();
  return result;
};

const getASingleAcademySemister = async (id: string) => {
  const result = await AcademicSemister.findById(id);
  return result;
};

const updateAcademicSemister = async (
  payload: Partial<TAcademicSemister>,
  id: string
) => {
  if (
    payload?.name &&
    payload?.code &&
    academicSemisterNameCodeStructure[payload.name] !== payload.code
  ) {
    throw new Error('Invalid semister code');
  }

  const isSemisterExist = await AcademicSemister.findById(id);
  if (!isSemisterExist) {
    throw new Error('this semister does not exist');
  }

  const { name, year } = payload;
  const query: Record<string, unknown> = {};

  if (name && year) {
    query.year = year;
    query.name = name;
  } else if (name) {
    query.name = name;
    query.year = isSemisterExist?.year;
  } else if (year) {
    query.name = isSemisterExist?.name;
    query.year = year;
  }

  if (Object.keys(query).length) {
    const existingSemister = await AcademicSemister.findOne(query);
    if (existingSemister) {
      throw new Error('This semister already exists');
    }
  }

  // if (year && name) {
  //   const isSemisterExist = await AcademicSemister.findOne({ year, name });
  //   if (isSemisterExist) {
  //     throw new Error('this semister is already exists');
  //   }
  // } else if (name) {
  //   const isSemisterNameExist = await AcademicSemister.findOne({
  //     year: isSemisterExist?.year,
  //     name: name,
  //   });
  //   if (isSemisterNameExist) {
  //     throw new Error('this semister is already exists');
  //   }
  // } else if (year) {
  //   const isSemisterNameExist = await AcademicSemister.findOne({
  //     year: year,
  //     name: isSemisterExist?.name,
  //   });
  //   if (isSemisterNameExist) {
  //     throw new Error('this semister is already exists');
  //   }
  // }

  const result = await AcademicSemister.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};
export const academicSemisterServie = {
  createAcademicSemister,
  getAllAcademySemister,
  getASingleAcademySemister,
  updateAcademicSemister,
};
