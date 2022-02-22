import { DeleteTransactionDto } from "../dto/delete-transaction.dto";

export class DeleteTransactionCommand {
  constructor(
    public readonly dto: DeleteTransactionDto
  ) {
  }
}
