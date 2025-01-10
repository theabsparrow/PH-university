import { z } from 'zod';
import { semisterRegistrationStatus } from './semisterRegistration.constant';

const semisterRegistrationValidationSchema = z.object({
  academicSemister: z.string(),
  status: z.enum([...(semisterRegistrationStatus as [string, ...string[]])]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  minCredit: z.number({
    required_error: 'min credit must be number',
  }),
  maxCredit: z.number({
    required_error: 'max credit must be number',
  }),
});

const updateSemisterRegistrationValidationSchema = z.object({
  academicSemister: z.string().optional(),
  status: z
    .enum([...(semisterRegistrationStatus as [string, ...string[]])])
    .optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  minCredit: z
    .number({
      required_error: 'min credit must be number',
    })
    .optional(),
  maxCredit: z
    .number({
      required_error: 'max credit must be number',
    })
    .optional(),
});

export const semisterRegistrationValidation = {
  semisterRegistrationValidationSchema,
  updateSemisterRegistrationValidationSchema,
};
