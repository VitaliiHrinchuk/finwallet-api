import { CreateUserCommandHandler } from "./create-user-command-handler";
import { ShowUserQueryHandler } from "./show-user-query-handler";
import { CheckUserQueryHandler } from "./check-user-query-handler";
import { SetupUserCommandHandler } from "./setup-user-command-handler";

export const commandHandlers = [
  CreateUserCommandHandler,
  ShowUserQueryHandler,
  CheckUserQueryHandler,
  SetupUserCommandHandler
];
