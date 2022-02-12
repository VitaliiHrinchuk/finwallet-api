import { CreateCategoryCommandHandler } from "./create-category.command-handler";
import { ListCategoryQueryHandler } from "./list-category.query-handler";
import { ShowCategoryQueryHandler } from "./show-category.query-handler";
import { DeleteCategoryCommandHandler } from "./delete-category.command-handler";
import { UpdateCategoryCommandHandler } from "./update-category.command-handler";

export const commandHandlers = [
  CreateCategoryCommandHandler,
  ListCategoryQueryHandler,
  ShowCategoryQueryHandler,
  DeleteCategoryCommandHandler,
  UpdateCategoryCommandHandler
];
