import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { CategoryAggregateRoot } from "../domain/category-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { UpdateCategoryCommand } from "../commands/update-category.command";
import { AccessDeniedException, EntityNotFoundException, ValidationException } from "../../common/exceptions";
import { InjectModel } from "@nestjs/sequelize";
import {  Category } from "../models/category.model";
import { strToSnakeCase } from "../../common/helpers/str-to-snake-case";
import { CategoryEntity } from "../domain/category.entity";

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler implements ICommandHandler<UpdateCategoryCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Category) private readonly categories: typeof Category,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<any> {
    await this.validate(command);

    const category: CategoryAggregateRoot = new CategoryAggregateRoot(command.dto.id);

    const slug: string = this.generateSlug(command.dto.name)

    category.update(
      command.dto.name,
      slug,
    );

    await this.repository.save(category);

    const instance: Category = await this.categories.findByPk(category.getId());

    return CategoryEntity.fromJSON(instance.toJSON());
  }

  async validate(command: UpdateCategoryCommand): Promise<void> {
    const category = await this.categories.findOne({
      where: {
        id: command.dto.id,
        createdBy: command.dto.userId
      }
    });

    if (!category) {
      throw new EntityNotFoundException("Category");
    }

    // const slug: string = this.generateSlug(command.dto.name);
    //
    // const category: Category = await this.categories.findOne({
    //   where: {
    //     slug: slug
    //   }
    // });
    //
    // if (!!category) {
    //   throw new ValidationException([{field: 'name', message: 'category with this name already exists'}])
    // }

  }

  private generateSlug(name): string {
    return strToSnakeCase(name);
  }
}
