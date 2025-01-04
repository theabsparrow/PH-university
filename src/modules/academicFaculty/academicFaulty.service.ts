import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaculty } from './academicFaculty.Model';

const createAcademicFaculty = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload);
  return result;
};

const getAllAcademicFaculty = async () => {
  const result = await AcademicFaculty.find();
  return result;
};

const getSingleAcademicFaculty = async (id: string) => {
  const result = await AcademicFaculty.findById(id);
  if (!result) {
    throw new Error('This academy faculty does not exist');
  }
  return result;
};

const updateAcademicFaculty = async (
  id: string,
  payload: Partial<TAcademicFaculty>
) => {
  const isAcademyFacultyExists = await AcademicFaculty.findById(id);
  if (!isAcademyFacultyExists) {
    throw new Error('this academy faculty does not exist');
  }
  const result = await AcademicFaculty.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

export const academicFacultyService = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
};
