import { Model } from "sequelize-typescript";
import Sequelize, { FindAndCountOptions, FindOptions, Includeable, Op, Order, WhereOptions } from "sequelize";
import { Pagination } from "../pagination";
import { InjectModel } from "@nestjs/sequelize";
import { DomainEntity } from "../interfaces/domain-entity";

type NonAbstract<T> = { [P in keyof T]: T[P] };
type Constructor<T> = (new () => T);
type NonAbstractTypeOfModel<T> = Constructor<T> & NonAbstract<typeof Model>;

type FindResponse<T> = {
  count: number;
  rows: T[]
};

interface OperatorsType {
  [key: string]: symbol;
}

const Operators: OperatorsType = {
  '=': Op.eq,
  '>=': Op.gte,
  '<=': Op.lte,
  '>': Op.gt,
  '<': Op.lt
}

export class QueryBuilder<T extends Model<T>> {

  private query: FindAndCountOptions;

  private whereClause: any = {};

  private whereSymbol: symbol = Op.and;

  constructor(private model: NonAbstractTypeOfModel<T>, private entity: typeof DomainEntity) {
    this.query = {};
    this.query.offset = 0;
    this.query.limit = 15;
  }

  public setOffset(offset: number): QueryBuilder<T> {
    this.query.offset = offset;
    return this;
  }

  public setLimit(limit: number): QueryBuilder<T> {
    this.query.limit = limit;
    return this;
  }

  public where(key: string, op: string, value: any): QueryBuilder<T> {
    this.queryWhereClause(key, op, value);

    return this;
  }

  public whereOr(key: string, op: string, value: any): QueryBuilder<T> {
    this.queryWhereClause(key, op, value);

    this.whereSymbol = Op.or;

    return this;
  }

  public include(include: Includeable | Includeable[]): QueryBuilder<T> {
    this.query.include = include;
    return this;
  }

  public order(order: Order): QueryBuilder<T> {
    this.query.order = order;
    return this;
  }

  public async paginate<R>(limit: number = 15, page: number = 1): Promise<Pagination<R>> {
    this.prepare();

    this.query.limit = limit;
    this.query.offset = (page - 1) * limit;
    const result: FindResponse<T> = await this.model.findAndCountAll(this.query);
    const mapped: any[] = result.rows.map(row => new this.entity(row.toJSON()));

    return Pagination.fromJSON<R>(mapped, limit, result.count - 1, page);
  }

  public prepare(): void {
    this.buildWhereClause();
    this.query.subQuery = false;
  }

  private queryWhereClause(key: string, op: string, value: any): void {
    console.log('op', op, key);
    if(Operators[op] == Op.eq) {
      //this.whereClause[key] = value;
      this._setWhereParameter(key, value);
    } else {
      // this.whereClause[key] = {
      //   [Operators[op]]: value
      // };
      this._setWhereParameter(key, {
        [Operators[op]]: value
      });
    }
  }
  private _setWhereParameter(key, value) {
    if (this.whereClause[key]) {
      this.whereClause[key] = {
        [Op.and]: {
          ...this.whereClause[key]
        }
      };
    } else {
      this.whereClause[key] = value;
    }
  }

  private buildWhereClause(): void {
    const whereSymbol: symbol = this.whereSymbol;
    this.query.where = {
      [whereSymbol]: this.whereClause
    };

  };


}
