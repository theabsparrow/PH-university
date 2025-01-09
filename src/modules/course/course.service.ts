import QueryBuilder from '../../builder/QueryBuilder';
import { courseSearchAbleFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourse = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisite.course'),
    query
  )
    .search(courseSearchAbleFields)
    .filter()
    .sort()
    .paginateQuery()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

const getASingleCourse = async (id: string) => {
  const result = await Course.findById(id);
  return result;
};

const updateACourse = async (id: string, payload: Partial<TCourse>) => {
  const result = await Course.findByIdAndUpdate(id, payload);
  return result;
};

const deleteACourse = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const courseService = {
  createCourse,
  getAllCourse,
  getASingleCourse,
  updateACourse,
  deleteACourse,
};
