import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DomainEvent, Projector } from "nest-event-sourcing";
import { Tag } from "../models/tag.model";
import { TagCreated } from "../events/tag-created.event";
import { TagDeleted } from "../events/tag-deleted.event";
import { TagUpdated } from "../events/tag-updated.event";

@Injectable()
export class TagProjector extends Projector {

  constructor(
    @InjectModel(Tag) private readonly categories: typeof Tag
  ) {
    super();
  }

  private async loadInstance(event: DomainEvent): Promise<Tag> {
      const id: string = event.aggregateId;
      return this.categories.findByPk(id)
  }

  async applyTagCreated(event: TagCreated) {
    await this.categories.create({
      id: event.aggregateId,
      name: event.payload.name,
      slug: event.payload.slug,
      categoryType: event.payload.categoryType,
      createdBy: event.payload.createdBy,
    })
  }

  async applyTagDeleted(event: TagDeleted) {
    await this.categories.destroy({
      where: {
        id: event.aggregateId
      }
    })

  }

  async applyTagUpdated(event: TagUpdated) {
    const category: Tag = await this.loadInstance(event);

    category.name = event.payload.name;
    category.slug = event.payload.slug;

    await category.save();
  }
}
