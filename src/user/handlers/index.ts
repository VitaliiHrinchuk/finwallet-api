import { CreateUserCommandHandler } from "./create-user-command-handler";
import { ShowUserQueryHandler } from "./show-user-query-handler";
import { CheckUserQueryHandler } from "./check-user-query-handler";

export const commandHandlers = [
  CreateUserCommandHandler,
  ShowUserQueryHandler,
  CheckUserQueryHandler
];
