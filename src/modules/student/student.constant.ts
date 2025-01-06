import { TBloodGroup, TGender } from './student.interface';

export const BloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const Gender: TGender[] = ['male', 'female', 'other'];

type TStudentSearchableFields = string[];
export const studentSearchAbleFields: TStudentSearchableFields = [
  'email',
  'name.firstName',
  'presentAddress',
];
