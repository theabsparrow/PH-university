import { TStatus } from './user.interface';

export const USER_ROLE = {
  admin: 'admin',
  faculty: 'faculty',
  student: 'student',
} as const;

export const Status: TStatus[] = ['in-progress', 'blocked'];
