import { z } from 'zod';
const preRequisiteValidationSchema = z.object({
  course: z.string({
    required_error: 'course id must be string',
  }),
});

const updatePreRequisiteValidationSchema = z.object({
  course: z.string({
    required_error: 'course id must be string',
  }),
  isDeleted: z.boolean({
    required_error: 'isDeleted should be boolean',
  }),
});

const courseValidationSchema = z.object({
  title: z
    .string({
      required_error: 'title must be string',
    })
    .min(5, 'title can`t be less than 2 character')
    .max(40, 'title can`t be more than 40 character'),
  prefix: z
    .string({
      required_error: 'prefix must be string',
    })
    .min(2, 'prefix can`t be less than 2 character')
    .max(10, 'prefix can`t be more than 10 character')
    .refine((value) => /^[A-Z]+$/.test(value), {
      message: 'prefix must be in all capital letters',
    }),
  code: z.number({
    required_error: 'code must be number',
  }),
  credit: z.number({
    required_error: 'credit must be number',
  }),
  preRequisite: z.array(preRequisiteValidationSchema).optional(),
});

const updateCourseValidationSchema = z.object({
  title: z
    .string({
      required_error: 'title must be string',
    })
    .min(5, 'title can`t be less than 2 character')
    .max(40, 'title can`t be more than 40 character')
    .optional(),
  prefix: z
    .string({
      required_error: 'prefix must be string',
    })
    .min(2, 'prefix can`t be less than 2 character')
    .max(10, 'prefix can`t be more than 10 character')
    .refine((value) => /^[A-Z]+$/.test(value), {
      message: 'prefix must be in all capital letters',
    })
    .optional(),
  code: z
    .number({
      required_error: 'code must be number',
    })
    .optional(),
  credit: z
    .number({
      required_error: 'credit must be number',
    })
    .optional(),
  preRequisite: z.array(updatePreRequisiteValidationSchema).optional(),
});

export const courseValidation = {
  courseValidationSchema,
  updateCourseValidationSchema,
};
