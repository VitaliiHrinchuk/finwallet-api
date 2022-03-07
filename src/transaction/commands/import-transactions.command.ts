import { ImportTransactionsDto } from "../dto/import-transactions.dto";

export class ImportTransactionsCommand {
  constructor(
    public readonly dto: ImportTransactionsDto
  ) {
  }
}
