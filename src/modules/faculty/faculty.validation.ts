import { z } from 'zod';
import {
  updateUserNameValidationSchema,
  userNameValidationSchema,
} from '../../global/validation';
import { BloodGroup, Gender } from '../../global/constant';

const facultyValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'password must be string',
    })
    .min(6, { message: 'password must be at least 6 character' })
    .max(20, { message: 'password can`t be more that 20 character' })
    .optional(),
  faculty: z.object({
    name: userNameValidationSchema,
    designation: z
      .string()
      .min(4, { message: 'designation can`t be less than 2 character' })
      .max(25, { message: 'designation can`t be more than 25 character' }),
    gender: z.enum([...Gender] as [string, ...string[]]),
    dateOfBirth: z.string({
      invalid_type_error: 'date must be string',
    }),
    email: z.string().email(),
    contactNo: z
      .string({
        invalid_type_error: 'contact no must be string',
      })
      .min(14, { message: 'contact number can`t be less than 14 character' })
      .max(14, { message: 'contact number can`t be more that 14 character' }),
    emergencyContactNo: z
      .string({
        invalid_type_error: 'emergency contact no must be string',
      })
      .min(14, { message: 'contact number can`t be less than 14 character' })
      .max(14, { message: 'contact number can`t be more that 14 character' }),
    bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]),
    presentAddress: z.string(),
    parmanentAddress: z.string(),
    academicDepartment: z.string({
      invalid_type_error: 'academic department is required',
    }),
  }),
});

const updateFacultyValidationSchema = z.object({
  faculty: z.object({
    name: updateUserNameValidationSchema.optional(),
    designation: z
      .string()
      .min(4, { message: 'designation can`t be less than 2 character' })
      .max(25, { message: 'designation can`t be more than 25 character' })
      .optional(),
    gender: z.enum([...Gender] as [string, ...string[]]).optional(),
    dateOfBirth: z
      .string({
        invalid_type_error: 'date must be string',
      })
      .optional(),
    email: z.string().email().optional(),
    contactNo: z
      .string({
        invalid_type_error: 'contact no must be string',
      })
      .min(14, { message: 'contact number can`t be less than 14 character' })
      .max(14, { message: 'contact number can`t be more that 14 character' })
      .optional(),
    emergencyContactNo: z
      .string({
        invalid_type_error: 'emergency contact no must be string',
      })
      .min(14, { message: 'contact number can`t be less than 14 character' })
      .max(14, { message: 'contact number can`t be more that 14 character' })
      .optional(),
    bloodGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
    presentAddress: z.string().optional(),
    parmanentAddress: z.string().optional(),
    academicDepartment: z
      .string({
        invalid_type_error: 'academic department is required',
      })
      .optional(),
  }),
});

export const facultyValidation = {
  facultyValidationSchema,
  updateFacultyValidationSchema,
};
