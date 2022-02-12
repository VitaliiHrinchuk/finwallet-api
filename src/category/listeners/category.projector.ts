import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DomainEvent, Projector } from "nest-event-sourcing";
import { Category } from "../models/category.model";
import { CategoryCreated } from "../events/category-created.event";
import { CategoryDeleted } from "../events/category-deleted.event";
import { CategoryUpdated } from "../events/category-updated.event";

@Injectable()
export class CategoryProjector extends Projector {

  constructor(
    @InjectModel(Category) private readonly categories: typeof Category
  ) {
    super();
  }

  private async loadInstance(event: DomainEvent): Promise<Category> {
      const id: string = event.aggregateId;
      return this.categories.findByPk(id)
  }

  async applyCategoryCreated(event: CategoryCreated) {
    await this.categories.create({
      id: event.aggregateId,
      name: event.payload.name,
      slug: event.payload.slug,
      categoryType: event.payload.categoryType,
      createdBy: event.payload.createdBy,
    })
  }

  async applyCategoryDeleted(event: CategoryDeleted) {
    await this.categories.destroy({
      where: {
        id: event.aggregateId
      }
    })

  }

  async applyCategoryUpdated(event: CategoryUpdated) {
    const category: Category = await this.loadInstance(event);

    category.name = event.payload.name;
    category.slug = event.payload.slug;

    await category.save();
  }
}
