import { CreateCategoryCommand } from "../commands/create-category.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { CategoryAggregateRoot } from "../domain/category-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "../models/category.model";
import { ValidationException } from "../../common/exceptions";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Category) private readonly categories: typeof Category,
  ) {}

  async execute(command: CreateCategoryCommand): Promise<any> {
    await this.validate(command);

    const category: CategoryAggregateRoot = new CategoryAggregateRoot();

    const slug: string = this.generateSlug(command.dto.name)

    category.create(
      command.dto.name,
      slug,
      command.dto.categoryType,
      command.dto.userId,
    );

    return this.repository.save(category);
  }

  async validate(command: CreateCategoryCommand): Promise<void> {
    const slug: string = this.generateSlug(command.dto.name);

    const category: Category = await this.categories.findOne({
      where: {
        slug: slug
      }
    });

    if (!!category) {
      throw new ValidationException([{field: 'name', message: 'category with this name already exists'}])
    }
  }

  private generateSlug(name): string {
    return name.split(' ').map(str=> str.toLowerCase()).join('_')
  }
}
