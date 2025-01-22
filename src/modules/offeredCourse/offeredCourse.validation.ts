import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },
  {
    message: 'Invalid time format , expected "HH:MM" in 24 hours format',
  }
);

const offeredCourseValidationSchema = z.object({
  semisterRegistration: z.string(),
  academicDepartment: z.string(),
  course: z.string(),
  faculty: z.string(),
  section: z.number(),
  maxCapacity: z.number(),
  days: z.array(z.enum([...Days] as [string, ...string[]])),
  startTime: timeStringSchema,
  endTime: timeStringSchema,
});

const updateOfferedCourseValidationSchema = z.object({
  faculty: z.string(),
  maxCapacity: z.number(),
  days: z.array(z.enum([...Days] as [string, ...string[]])),
  startTime: timeStringSchema,
  endTime: timeStringSchema,
});

export const offeredCourseValidation = {
  offeredCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
