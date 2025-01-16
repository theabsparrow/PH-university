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

// http://localhost:3000?id=A-0002&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJBLTAwMDIiLCJ1c2VyUm9sZSI6ImFkbWluIiwiaWF0IjoxNzM3MDU1NDExLCJleHAiOjE3MzcwNTYwMTF9.7r6josuVPMKTaOAyIE1nZQxZVAtgNGxAOECp4SK8qME
