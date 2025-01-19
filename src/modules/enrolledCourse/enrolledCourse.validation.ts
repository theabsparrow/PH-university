import { z } from 'zod';

const enrolledCourseValidationSchema = z.object({
  offeredCourse: z.string({
    required_error: 'offered course is required',
  }),
});

const updateEnrolledCourseValidationSchema = z.object({
  semisterRegistration: z.string(),
  offeredCourse: z.string(),
  student: z.string(),
  courseMarks: z.object({
    classTest1: z
      .number({
        required_error: 'class test one is required',
      })
      .min(0, 'class test 1 can`t be a negeative number')
      .max(10, 'class test 1 can`t be more than 10')
      .optional(),
    midTerm: z
      .number({
        required_error: 'mid term is required',
      })
      .min(0, 'mid term can`t be a negeative number')
      .max(30, 'mid term can`t be more than 30')
      .optional(),
    classTest2: z
      .number({
        required_error: 'class test two is required',
      })
      .min(0, 'class test 2 can`t be a negeative number')
      .max(10, 'class test 2 can`t be more than 10')
      .optional(),
    finalTerm: z
      .number({
        required_error: 'final term is required',
      })
      .min(0, 'final term can`t be a negeative number')
      .max(50, 'final term can`t be more than 50')
      .optional(),
  }),
});
export const enrolledCourseValidation = {
  enrolledCourseValidationSchema,
  updateEnrolledCourseValidationSchema,
};
