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
    const categoryModels = await this.categories.findAll({
      where: {
        createdBy: {
          [Op.or]: [command.userId, null]
        }
      },
      include: [
        {
          model: User,
        }
      ]
    });

    return categoryModels.map(model => new CategoryEntity(model.toJSON()));
  }
}
