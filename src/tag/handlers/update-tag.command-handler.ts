import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { TagAggregateRoot } from "../domain/tag-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { UpdateTagCommand } from "../commands/update-tag.command";
import { AccessDeniedException, EntityNotFoundException, ValidationException } from "../../common/exceptions";
import { InjectModel } from "@nestjs/sequelize";
import {  Tag } from "../models/tag.model";
import { strToSnakeCase } from "../../common/helpers/str-to-snake-case";
import { TagEntity } from "../domain/tag.entity";

@CommandHandler(UpdateTagCommand)
export class UpdateTagCommandHandler implements ICommandHandler<UpdateTagCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Tag) private readonly tags: typeof Tag,
  ) {}

  async execute(command: UpdateTagCommand): Promise<any> {
    await this.validate(command);

    const tag: TagAggregateRoot = new TagAggregateRoot(command.dto.id);

    const slug: string = this.generateSlug(command.dto.name)

    tag.update(
      command.dto.name,
      slug,
    );

    await this.repository.save(tag);

    const instance: Tag = await this.tags.findByPk(tag.getId());

    return TagEntity.fromJSON(instance.toJSON());
  }

  async validate(command: UpdateTagCommand): Promise<void> {
    const category = await this.tags.findOne({
      where: {
        id: command.dto.id,
        createdBy: command.dto.userId
      }
    });

    if (!category) {
      throw new EntityNotFoundException("Tag");
    }

  }

  private generateSlug(name): string {
    return strToSnakeCase(name);
  }
}
