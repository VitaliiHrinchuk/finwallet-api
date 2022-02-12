import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { CategoryAggregateRoot } from "../domain/category-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { DeleteCategoryCommand } from "../commands/delete-category.command";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "../models/category.model";
import { AccessDeniedException, EntityNotFoundException } from "../../common/exceptions";

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryCommandHandler implements ICommandHandler<DeleteCategoryCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Category) private readonly categories: typeof Category,
  ) {}

  async execute(command: DeleteCategoryCommand): Promise<any> {
    await this.validate(command);

    const account: CategoryAggregateRoot = new CategoryAggregateRoot(command.dto.id);

    account.remove();

    return this.repository.save(account);
  }

  async validate(command: DeleteCategoryCommand): Promise<void> {
    const category = await this.categories.findOne({
      where: {
        id: command.dto.id
      }
    });

    if (!category) {
      throw new EntityNotFoundException("Category");
    }

    if (category.createdBy != command.dto.userId) {
      throw new AccessDeniedException("You can delete only categories created by you")
    }

  }
}
