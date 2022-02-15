import { CreateTagCommandHandler } from "./create-tag.command-handler";
import { ListTagQueryHandler } from "./list-tag.query-handler";
import { ShowTagQueryHandler } from "./show-tag.query-handler";
import { DeleteTagCommandHandler } from "./delete-tag.command-handler";
import { UpdateTagCommandHandler } from "./update-tag.command-handler";

export const commandHandlers = [
  CreateTagCommandHandler,
  ListTagQueryHandler,
  ShowTagQueryHandler,
  DeleteTagCommandHandler,
  UpdateTagCommandHandler
];
