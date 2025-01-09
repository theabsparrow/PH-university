import { z } from 'zod';

const courseFAcultiesValidationSchema = z.object({
  faculties: z.array(z.string()),
});

export const courseFacultyValidation = {
  courseFAcultiesValidationSchema,
};
