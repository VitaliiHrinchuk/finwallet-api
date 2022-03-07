import { ImportTransactionsDto } from "../dto/import-transactions.dto";

export class ImportTransactionCommand {
  constructor(
    public readonly dto: ImportTransactionsDto
  ) {
  }
}
