import { UpdateTransactionDto } from "../dto/update-transaction.dto";

export class UpdateTransactionCommand {
  constructor(
    public readonly dto: UpdateTransactionDto
  ) {
  }
}
