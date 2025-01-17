import { z } from 'zod';
import { Status } from './user.constant';

const userValidationSchema = z.object({
  id: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .min(6, { message: 'Password can`t be less than 6 character' })
    .max(20, { message: 'Password can`t be more than 20 character' })
    .optional(),
});

const changeUserStatusValidationSchema = z.object({
  status: z.enum([...Status] as [string, ...string[]]),
});

export const userValidation = {
  userValidationSchema,
  changeUserStatusValidationSchema,
};
