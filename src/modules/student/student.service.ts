import { Student } from './student.model';

const getAllStudent = async () => {
  const result = await Student.find();
  return result;
};

const getSingleStudent = async (id: string) => {
  const result = await Student.findById(id);
  return result;
};

const deleteStudent = async (id: string) => {
  const result = await Student.findByIdAndUpdate(id, { isDeleted: true });
  return result;
};
export const studentService = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
};
