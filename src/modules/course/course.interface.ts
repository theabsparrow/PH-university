import { Types } from 'mongoose';

export type TPreRequisite = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credit: number;
  preRequisite?: TPreRequisite[];
  isDeleted: boolean;
};
