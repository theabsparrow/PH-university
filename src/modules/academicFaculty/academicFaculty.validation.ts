import { z } from 'zod';

const academicFacultyValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'academic faculty must be string',
  }),
});

const updateAcademicFacultyValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'academic faculty must be string',
    })
    .optional(),
});

export const academicFacultyValidation = {
  academicFacultyValidationSchema,
  updateAcademicFacultyValidationSchema,
};
