import { AggregateRoot } from "nest-event-sourcing";
import { CategoryCreated } from "../events/category-created.event";
import { CategoryDeleted } from "../events/category-deleted.event";
import { CategoryUpdated } from "../events/category-updated.event";

export class CategoryAggregateRoot extends AggregateRoot {
  public create(name: string, slug: string, categoryType: string,  createdBy: string): void {
    const event: CategoryCreated = new CategoryCreated();

    event.payload = {
      name, slug, categoryType, createdBy
    };

    this.record(event);
  }

  public remove() {
    const event: CategoryDeleted = new CategoryDeleted();

    this.record(event)
  }

  public update(name: string, slug) {
    const event: CategoryUpdated = new CategoryUpdated();

    event.payload = {
      name, slug
    };

    this.record(event)
  }
}
