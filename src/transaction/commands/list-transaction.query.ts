import { ListTransactionDto } from "../dto/list-transaction.dto";

export class ListTransactionQuery {
  constructor(
    public readonly dto: ListTransactionDto
  ) {
  }
}
