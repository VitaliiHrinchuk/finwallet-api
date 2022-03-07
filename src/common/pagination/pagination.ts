import { PaginationMeta } from "./pagination-meta";
import { DomainEntity } from "../interfaces/domain-entity";

export class Pagination<T> {
  constructor(readonly data: T[], readonly meta: PaginationMeta) {}

  public static fromJSON<T extends DomainEntity>(data: T[], perPage: number, total: number, page: number): Pagination<T> {
    return new Pagination<T>(data, new PaginationMeta(perPage, total, page));
  }
}
