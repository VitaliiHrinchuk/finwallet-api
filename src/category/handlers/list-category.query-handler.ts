import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ListCategoryQuery } from "../commands/list-category.query";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "../models/category.model";
import { User } from "../../user/models/user.model";
import { CategoryEntity } from "../domain/category.entity";
import { Op } from "sequelize";
import { ListAccountsQuery } from "../../account/commands/list-accounts.query";
import { Pagination } from "../../common/pagination";
import { AccountEntity } from "../../account/domain/account.entity";
import { QueryBuilder } from "../../common/helpers/query-builder";
import { Account } from "../../account/models/account.model";
import { InternalServerErrorException } from "@nestjs/common";

@CommandHandler(ListCategoryQuery)
export class ListCategoryQueryHandler implements ICommandHandler<ListCategoryQuery> {

  constructor(
    @InjectModel(Category) private readonly categories: typeof Category,
    ) {}

  async execute(command: ListCategoryQuery): Promise<any> {
    try {
      return this.query(command);
    } catch (error) {
      console.log('err', error);
      throw new InternalServerErrorException();
    }
  }

  async query(command: ListCategoryQuery): Promise<Pagination<CategoryEntity>> {
    const query: QueryBuilder<Category> = new QueryBuilder<Category>(
      Category,
      CategoryEntity
    );

    query.where("categoryType",'=', command.dto.categoryType);
    // query.where("categoryType",'=', command.dto.categoryType);

    return query.order([["updatedAt", "DESC"]])
      .paginate(100, 1);
  }

  // private createFilters(command: ListCategoryQuery): any {
  //   const filters: any = {
  //     createdBy: {
  //       [Op.or]: [command.dto.userId, null]
  //     }
  //   };
  //
  //   if (command.dto.categoryType) {
  //     filters.categoryType = command.dto.categoryType;
  //   }
  //
  //   return filters;
  // }
}
