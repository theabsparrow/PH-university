import { z } from 'zod';
import {
  AcademicSemisterCode,
  AcademicSmeisterName,
  Months,
} from './academicSemister.constant';

const academicSemisterValidationSchema = z.object({
  name: z.enum([...AcademicSmeisterName] as [string, ...string[]]),
  code: z.enum([...AcademicSemisterCode] as [string, ...string[]]),
  year: z.string(),
  startMonth: z.enum([...Months] as [string, ...string[]]),
  endMonth: z.enum([...Months] as [string, ...string[]]),
});

export const academicSemisterValidation = {
  academicSemisterValidationSchema,
};
