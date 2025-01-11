import { Types } from 'mongoose';

export type TDay = 'Sat' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export type TOfferedCourse = {
  semisterRegistration: Types.ObjectId;
  academicSemister?: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  course: Types.ObjectId;
  faculty: Types.ObjectId;
  maxCapacity: number;
  section: number;
  days: TDay[];
  startTime: string;
  endTime: string;
};

export type TSchedule = {
  days: TDay[];
  startTime: string;
  endTime: string;
};
