import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ListTagQuery } from "../commands/list-tag.query";
import { InjectModel } from "@nestjs/sequelize";
import { Tag } from "../models/tag.model";
import { User } from "../../user/models/user.model";
import { TagEntity } from "../domain/tag.entity";
import { Op } from "sequelize";

@CommandHandler(ListTagQuery)
export class ListTagQueryHandler implements ICommandHandler<ListTagQuery> {

  constructor(
    @InjectModel(Tag) private readonly tags: typeof Tag,
    ) {}

  async execute(command: ListTagQuery): Promise<any> {
    const tagModels = await this.tags.findAll({
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

    return tagModels.map(model => new TagEntity(model.toJSON()));
  }
}
