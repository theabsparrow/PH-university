import { z } from 'zod';
import {
  AcademicSemisterCode,
  AcademicSmeisterName,
  Months,
} from './academicSemister.constant';

const academicSemisterValidationSchema = z.object({
  name: z.enum([...AcademicSmeisterName] as [string, ...string[]]),
  code: z.enum([...AcademicSemisterCode] as [string, ...string[]]),
  year: z.string({
    invalid_type_error: 'year must be string',
  }),
  startMonth: z.enum([...Months] as [string, ...string[]]),
  endMonth: z.enum([...Months] as [string, ...string[]]),
});

const updateAcademicSemisterVAlidationSchema = z.object({
  name: z.enum([...AcademicSmeisterName] as [string, ...string[]]).optional(),
  code: z.enum([...AcademicSemisterCode] as [string, ...string[]]).optional(),
  year: z
    .string({
      invalid_type_error: 'year must be string',
    })
    .optional(),
  startMonth: z.enum([...Months] as [string, ...string[]]).optional(),
  endMonth: z.enum([...Months] as [string, ...string[]]).optional(),
});
export const academicSemisterValidation = {
  academicSemisterValidationSchema,
  updateAcademicSemisterVAlidationSchema,
};
