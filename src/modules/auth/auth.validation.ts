import { z } from 'zod';

const loginValidationSchema = z.object({
  id: z.string({
    required_error: 'ID is required',
  }),
  password: z.string({
    required_error: 'password is required',
  }),
});

const passwordChangeValidationSchema = z.object({
  oldPassword: z.string({
    required_error: 'old password is required',
  }),
  newPassword: z.string({
    required_error: 'new password is required',
  }),
});

const refreshTokenValidationSchema = z.object({
  refreshToken: z.string({
    required_error: 'refresh token is required',
  }),
});

const forgetPasswordValidationSchema = z.object({
  id: z.string({
    required_error: 'id is required',
  }),
});

const resetPasswordValidationSchema = z.object({
  id: z.string({
    required_error: 'id is required',
  }),
  newPassword: z.string({
    required_error: 'new password is required',
  }),
});

export const loginValidation = {
  loginValidationSchema,
  passwordChangeValidationSchema,
  refreshTokenValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
