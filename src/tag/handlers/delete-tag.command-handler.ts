import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { TagAggregateRoot } from "../domain/tag-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { DeleteTagCommand } from "../commands/delete-tag.command";
import { InjectModel } from "@nestjs/sequelize";
import { Tag } from "../models/tag.model";
import { AccessDeniedException, EntityNotFoundException } from "../../common/exceptions";

@CommandHandler(DeleteTagCommand)
export class DeleteTagCommandHandler implements ICommandHandler<DeleteTagCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Tag) private readonly tags: typeof Tag,
  ) {}

  async execute(command: DeleteTagCommand): Promise<any> {
    await this.validate(command);

    const tag: TagAggregateRoot = new TagAggregateRoot(command.dto.id);

    tag.remove();

    return this.repository.save(tag);
  }

  async validate(command: DeleteTagCommand): Promise<void> {
    const category = await this.tags.findOne({
      where: {
        id: command.dto.id
      }
    });

    if (!category) {
      throw new EntityNotFoundException("Tag");
    }

    if (category.createdBy != command.dto.userId) {
      throw new AccessDeniedException("You can delete only tags created by you")
    }

  }
}
