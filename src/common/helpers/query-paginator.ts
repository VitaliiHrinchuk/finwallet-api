import { Model } from "sequelize-typescript";
import { FindAndCountOptions, FindOptions, Includeable, Order, WhereOptions } from "sequelize";
import { Pagination } from "../pagination";
import { InjectModel } from "@nestjs/sequelize";
import { DomainEntity } from "../interfaces/domain-entity";

type NonAbstract<T> = {[P in keyof T]: T[P]};
type Constructor<T> = (new () => T);
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;

type FindResponse<T> = {
  count: number;
  rows: T[]
};
export class QueryPaginator<T extends Model<T>> {

  private query: FindAndCountOptions;

  constructor(private model: NonAbstractTypeOfModel<T>, private entity: typeof DomainEntity) {
    this.query = {};
    this.query.offset = 0;
    this.query.limit = 15;
  }

  public setOffset(offset: number): QueryPaginator<T> {
    this.query.offset = offset;
    return this;
  }

  public setLimit(limit: number): QueryPaginator<T> {
    this.query.limit = limit;
    return this;
  }

  public where(whereClause: WhereOptions): QueryPaginator<T> {
    this.query.where = whereClause;
    return this;
  }

  public include(include: Includeable | Includeable[]): QueryPaginator<T> {
    this.query.include = include;
    return this;
  }

  public order(order: Order): QueryPaginator<T> {
    this.query.order = order;
    return this;
  }

  public async paginate<R>(limit: number = 15, page: number = 1): Promise<Pagination<R>> {
    this.query.limit = limit;
    this.query.offset = (page - 1) * limit;

    const result: FindResponse<T> = await this.model.findAndCountAll(this.query);
    const mapped: any[] = result.rows.map(row => new this.entity(row.toJSON()));

    return Pagination.fromJSON<R>(mapped, limit, result.count - 1, page);
  }


}
