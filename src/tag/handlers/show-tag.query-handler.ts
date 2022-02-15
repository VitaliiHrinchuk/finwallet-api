import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { Tag } from "../models/tag.model";
import { TagEntity } from "../domain/tag.entity";
import { User } from "../../user/models/user.model";
import { ShowTagQuery } from "../commands/show-tag.query";
import { Op } from "sequelize";

@CommandHandler(ShowTagQuery)
export class ShowTagQueryHandler implements ICommandHandler<ShowTagQuery> {

  constructor(
    @InjectModel(Tag) private readonly tags: typeof Tag,
  ) {}

  async execute(command: ShowTagQuery): Promise<any> {

    const tagModel = await this.tags.findOne({
      where: {
        id: command.id,
      },
      include: [
        {
          model: User,
        }
      ]
    });

    return new TagEntity(tagModel.toJSON());
  }
}
