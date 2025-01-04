import { z } from 'zod';

const academicDepartmentValidationSchema = z.object({
  name: z.string({
    invalid_type_error: 'Academic Department must be string',
  }),
  academicFaculty: z.string({
    invalid_type_error: 'Academic faculty ID must be string',
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  name: z
    .string({
      invalid_type_error: 'Academic Department must be string',
    })
    .optional(),
  academicFaculty: z
    .string({
      invalid_type_error: 'Academic faculty ID must be string',
    })
    .optional(),
});

export const academicDepartmentValidation = {
  academicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
