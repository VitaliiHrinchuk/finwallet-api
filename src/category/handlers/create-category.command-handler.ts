import { CreateCategoryCommand } from "../commands/create-category.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { CategoryAggregateRoot } from "../domain/category-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "../models/category.model";
import { ValidationException } from "../../common/exceptions";
import { strToSnakeCase } from "../../common/helpers/str-to-snake-case";
import { CategoryEntity } from "../domain/category.entity";

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
    console.log('dto', command.dto);
    category.create(
      command.dto.name,
      slug,
      command.dto.type.toString(),
      command.dto.userId,
    );

    await this.repository.save(category);

    const instance: Category = await this.categories.findByPk(category.getId());

    return CategoryEntity.fromJSON(instance.toJSON());
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
    return strToSnakeCase(name);
  }
}
