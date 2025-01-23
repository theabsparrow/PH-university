// const queryObject = { ...query };
  // const excludeFields = [
  //   'searchTerm',
  //   'sort',
  //   'sortOrder',
  //   'limit',
  //   'page',
  //   'fields',
  // ];
  // excludeFields.forEach((element) => delete queryObject[element]);

  // let searchTerm = '';
  // let sort = '-createdAt';
  // let limit = 0;
  // let page = 1;
  // let skip = 0;
  // let fields = '-_v';

  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQUery = Student.find({
  //   $or: studentSearchAbleFields.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // const filterQuery = searchQUery.find(queryObject);
  // .populate('user')
  // .populate('admissionSemister')
  // .populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty',
  //   },
  // });

  // if (query?.sort) {
  //   const sortOrder = query?.sortOrder === 'desc' ? '-' : '';
  //   const sortBy = query?.sort as string;
  //   sort = `${sortOrder}${sortBy}`;
  // }
  // const sortQuery = filterQuery.sort(sort);

  // if (query?.limit) {
  //   limit = Number(query?.limit);
  // }
  // if (query?.page) {
  //   page = Number(query?.page);
  //   skip = (page - 1) * limit;
  // }
  // const paginateQuery = sortQuery.skip(skip);
  // const limitQuery = paginateQuery.limit(limit);

  // if (query?.fields) {
  //   fields = (query?.fields as string).split(',').join(' ');
  // }
  // const fieldQuery = await limitQuery.select(fields);