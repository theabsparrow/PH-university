import { z } from 'zod';

const userValidationSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .min(6, { message: 'Password can`t be less than 6 character' })
    .max(20, { message: 'Password can`t be more than 20 character' })
    .optional(),
});

export const userValidation = {
  userValidationSchema,
};
