import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ListCategoryQuery } from "../commands/list-category.query";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "../models/category.model";
import { User } from "../../user/models/user.model";
import { CategoryEntity } from "../domain/category.entity";
import { Op } from "sequelize";

@CommandHandler(ListCategoryQuery)
export class ListCategoryQueryHandler implements ICommandHandler<ListCategoryQuery> {

  constructor(
    @InjectModel(Category) private readonly categories: typeof Category,
    ) {}

  async execute(command: ListCategoryQuery): Promise<any> {
    const filters = this.createFilters(command);

    const categoryModels = await this.categories.findAll({
      where: filters,
      include: [
        {
          model: User,
        }
      ]
    });

    return categoryModels.map(model => new CategoryEntity(model.toJSON()));
  }

  private createFilters(command: ListCategoryQuery): any {
    const filters: any = {
      createdBy: {
        [Op.or]: [command.dto.userId, null]
      }
    };

    if (command.dto.categoryType) {
      filters.categoryType = command.dto.categoryType;
    }

    return filters;
  }
}
