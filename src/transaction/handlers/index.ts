import { CreateTransactionCommandHandler } from "./create-transaction.command-handler";
import { ListTransactionQueryHandler } from "./list-transaction.query-handler";
import { ShowTransactionQueryHandler } from "./show-transaction.query-handler";
import { DeleteTransactionCommandHandler } from "./delete-transaction.command-handler";
import { UpdateTransactionCommandHandler } from "./update-transaction.command-handler";

export const commandHandlers = [
  CreateTransactionCommandHandler,
  ListTransactionQueryHandler,
  ShowTransactionQueryHandler,
  DeleteTransactionCommandHandler,
  UpdateTransactionCommandHandler
];
