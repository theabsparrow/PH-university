import { Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;
  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }
  search(searchAbleFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFields.map((field) => ({
          [field]: { $regex: searchTerm, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter() {
    const queryObject = { ...this.query };
    const excludeFields = [
      'searchTerm',
      'sort',
      'sortOrder',
      'limit',
      'page',
      'fields',
    ];
    excludeFields.forEach((element) => delete queryObject[element]);

    this.modelQuery = this.modelQuery.find(queryObject);
    return this;
  }

  sort() {
    const sortOrder = this?.query?.sortOrder === 'desc' ? '-' : '';
    const sortingData =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-_v';
    const sort = `${sortOrder}${sortingData}` || '-createdAt';
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  paginateQuery() {
    const limit = Number(this?.query?.limit) || 0;
    const page = Number(this?.query?.page) || 1;
    const skip = (page - 1) * limit || 0;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-_v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
}

export default QueryBuilder;
