import { CreateTransactionDto } from "../dto/create-transaction.dto";

export class CreateTransactionCommand {
  constructor(
    public readonly dto: CreateTransactionDto
  ) {
  }
}
