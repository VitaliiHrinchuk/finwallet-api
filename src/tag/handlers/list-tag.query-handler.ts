import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ListTagQuery } from "../commands/list-tag.query";
import { InjectModel } from "@nestjs/sequelize";
import { Tag } from "../models/tag.model";
import { User } from "../../user/models/user.model";
import { TagEntity } from "../domain/tag.entity";
import { Op } from "sequelize";
import { ListCategoryQuery } from "../../category/commands/list-category.query";
import { Pagination } from "../../common/pagination";
import { CategoryEntity } from "../../category/domain/category.entity";
import { QueryBuilder } from "../../common/helpers/query-builder";
import { Category } from "../../category/models/category.model";
import { InternalServerErrorException } from "@nestjs/common";

@CommandHandler(ListTagQuery)
export class ListTagQueryHandler implements ICommandHandler<ListTagQuery> {

  constructor(
    @InjectModel(Tag) private readonly tags: typeof Tag,
    ) {}

  async execute(command: ListTagQuery): Promise<any> {
    try {
      return this.query(command);
    } catch (error) {
      console.log('err', error);
      throw new InternalServerErrorException();
    }
  }

  async query(command: ListTagQuery): Promise<Pagination<TagEntity>> {
    const query: QueryBuilder<Tag> = new QueryBuilder<Tag>(
      Tag,
      TagEntity
    );

    return query.order([["updatedAt", "DESC"]])
      .paginate(100, 1);
  }
}
