import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "../models/category.model";
import { CategoryEntity } from "../domain/category.entity";
import { User } from "../../user/models/user.model";
import { ShowCategoryQuery } from "../commands/show-category.query";
import { Op } from "sequelize";

@CommandHandler(ShowCategoryQuery)
export class ShowCategoryQueryHandler implements ICommandHandler<ShowCategoryQuery> {

  constructor(
    @InjectModel(Category) private readonly categories: typeof Category,
  ) {}

  async execute(command: ShowCategoryQuery): Promise<any> {

    const categoryModel = await this.categories.findOne({
      where: {
        id: command.id,
      },
      include: [
        {
          model: User,
        }
      ]
    });
    console.log(typeof CategoryEntity.fromJSON(categoryModel.toJSON()).categoryType);
    return CategoryEntity.fromJSON(categoryModel.toJSON());
  }
}
