import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const offeredCourseValidationSchema = z.object({
  semisterRegistration: z.string(),
  academicFaculty: z.string(),
  academicDepartment: z.string(),
  course: z.string(),
  faculty: z.string(),
  section: z.number(),
  maxCapacity: z.number(),
  days: z.array(z.enum([...Days] as [string, ...string[]])),
  startTime: z.string(),
  endTime: z.string(),
});

const updateOfferedCourseValidationSchema = z.object({
  faculty: z.string().optional(),
  maxCapacity: z.number().optional(),
  days: z.array(z.enum([...Days] as [string, ...string[]])).optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const offeredCourseValidation = {
  offeredCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
