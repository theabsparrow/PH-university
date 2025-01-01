import { z } from 'zod';

const userNameValidationSchema = z.object({
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

const guardinValidationSchema = z.object({
  fatherName: z
    .string()
    .min(1, { message: 'father name can`t be less than one character' })
    .max(20, { message: 'father name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'father name must be start with a capital letter',
    }),
  fatherOccupation: z
    .string()
    .min(2, { message: 'occupation cna`t be less than 2 character' })
    .max(30, { message: 'occupation can`t be more than 30 character' }),
  fatherContactNo: z
    .string()
    .min(14, { message: 'contact number can`t be less than 14 character' })
    .max(14, { message: 'contact number can`t be more that 14 character' }),
  motherName: z
    .string()
    .min(1, { message: 'mother name can`t be less than one character' })
    .max(20, { message: 'mother name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'mother name must be start with a capital letter',
    }),
  motherOccupation: z
    .string()
    .min(2, { message: 'occupation cna`t be less than 2 character' })
    .max(30, { message: 'occupation can`t be more than 30 character' }),
  motherContactNo: z
    .string()
    .min(14, { message: 'contact number can`t be less than 14 character' })
    .max(14, { message: 'contact number can`t be more that 14 character' }),
});

const localGuardianValidationSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'name can`t be less than one character' })
    .max(20, { message: 'name can`t be more than 20 character' })
    .refine((value) => /^[A-Z]/.test(value), {
      message: 'name must be start with a capital letter',
    }),
  occupation: z
    .string()
    .min(2, { message: 'occupation cna`t be less than 2 character' })
    .max(30, { message: 'occupation can`t be more than 30 character' }),
  conatctNo: z
    .string()
    .min(14, { message: 'contact number can`t be less than 14 character' })
    .max(14, { message: 'contact number can`t be more that 14 character' }),
  address: z.string(),
});

const studentValidationSchema = z.object({
  id: z.string(),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string(),
  email: z.string().email(),
  contactNo: z.string(),
  emergencyContactNo: z.string(),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  presentAddress: z.string(),
  parmanentAddress: z.string(),
  guardian: guardinValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImage: z.string().optional(),
});

export default studentValidationSchema;
