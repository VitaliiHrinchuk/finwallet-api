import { CreateAccountCommandHandler } from "./create-account.command-handler";
import { ListAccountsQueryHandler } from "./list-accounts.query-handler";
import { ShowAccountQueryHandler } from "./show-account.query-handler";
import { DeleteAccountCommandHandler } from "./delete-account.command-handler";
import { UpdateAccountCommandHandler } from "./update-account.command-handler";

export const commandHandlers = [
  CreateAccountCommandHandler,
  ListAccountsQueryHandler,
  ShowAccountQueryHandler,
  DeleteAccountCommandHandler,
  UpdateAccountCommandHandler
];
