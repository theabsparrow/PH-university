import { Types } from 'mongoose';

export type TSemisterRegistration = {
  academicSemister: Types.ObjectId;
  status: 'UPCOMING' | 'ONGOING' | 'ENDED';
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};
