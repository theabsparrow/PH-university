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

export const academicSemisterServie = {
  createAcademicSemister,
};
