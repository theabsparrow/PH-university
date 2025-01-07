import { z } from 'zod';

export const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'first name can`t be less than one character' })
    .max(20, { message: 'first name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'first name must be start with a capital letter',
    }),
  middleName: z
    .string()
    .min(1, { message: 'middle name can`t be less than one character' })
    .max(20, { message: 'middle name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'middle name must be start with a capital letter',
    })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: 'last name can`t be less than one character' })
    .max(20, { message: 'last name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'last name must be start with a capital letter',
    }),
});

export const updateUserNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'first name can`t be less than one character' })
    .max(20, { message: 'first name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'first name must be start with a capital letter',
    })
    .optional(),
  middleName: z
    .string()
    .min(1, { message: 'middle name can`t be less than one character' })
    .max(20, { message: 'middle name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'middle name must be start with a capital letter',
    })
    .optional(),
  lastName: z
    .string()
    .min(1, { message: 'last name can`t be less than one character' })
    .max(20, { message: 'last name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'last name must be start with a capital letter',
    })
    .optional(),
});
