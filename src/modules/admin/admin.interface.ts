import { Types } from 'mongoose';
import { TBloodGroup, TGender, TUserName } from '../../interface';

export type TAdmin = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TUserName;
  gender: TGender;
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  parmanentAddress: string;
  profileImage?: string;
  isDeleted: boolean;
};
