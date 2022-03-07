export class PaginationMeta {
  readonly pageCount: number;

  readonly hasNextPage: boolean;

  readonly hasPrevPage: boolean;

  constructor(private readonly perPage: number, private readonly total: number, private readonly page: number) {
    this.pageCount = Math.ceil(this.total / this.perPage);
    this.hasPrevPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
