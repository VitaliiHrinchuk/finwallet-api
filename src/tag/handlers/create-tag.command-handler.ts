import { CreateTagCommand } from "../commands/create-tag.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { TagAggregateRoot } from "../domain/tag-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from "@nestjs/sequelize";
import { Tag } from "../models/tag.model";
import { ValidationException } from "../../common/exceptions";
import { strToSnakeCase } from "../../common/helpers/str-to-snake-case";
import { TagEntity } from "../domain/tag.entity";

@CommandHandler(CreateTagCommand)
export class CreateTagCommandHandler implements ICommandHandler<CreateTagCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Tag) private readonly tags: typeof Tag,
  ) {}

  async execute(command: CreateTagCommand): Promise<any> {
    await this.validate(command);

    const tag: TagAggregateRoot = new TagAggregateRoot();

    const slug: string = this.generateSlug(command.dto.name)

    tag.create(
      command.dto.name,
      slug,
      command.dto.userId,
    );

    await this.repository.save(tag);

    const instance: Tag = await this.tags.findByPk(tag.getId());

    return TagEntity.fromJSON(instance.toJSON());
  }

  async validate(command: CreateTagCommand): Promise<void> {
    const slug: string = this.generateSlug(command.dto.name);

    const category: Tag = await this.tags.findOne({
      where: {
        slug: slug
      }
    });

    if (!!category) {
      throw new ValidationException([{field: 'name', message: 'tag with this name already exists'}])
    }
  }

  private generateSlug(name): string {
    return strToSnakeCase(name)
  }
}
