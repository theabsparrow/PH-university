import {
  TAcademicSemisterCode,
  TAcademicSemisterName,
  TAcademicSemisterNameCodeStructure,
  TMonth,
} from './academicSemister.interface';

export const Months: TMonth[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSmeisterName: TAcademicSemisterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];
export const AcademicSemisterCode: TAcademicSemisterCode[] = ['01', '02', '03'];

export const academicSemisterNameCodeStructure: TAcademicSemisterNameCodeStructure =
  {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
  };

export const academicSemisterSearchableFields: string[] = [
  'name',
  'code',
  'year',
];
