type TMeta = {
  limit: number;
  page: number;
  total: number;
  totalPage: number;
}

export type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: TMeta
  data: T;
};

export type Tquery = Record<string, unknown>;

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-';

export type TGender = 'male' | 'female' | 'other';
