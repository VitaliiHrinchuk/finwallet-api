import { AggregateRoot } from "nest-event-sourcing";
import { TagCreated } from "../events/tag-created.event";
import { TagDeleted } from "../events/tag-deleted.event";
import { TagUpdated } from "../events/tag-updated.event";

export class TagAggregateRoot extends AggregateRoot {
  public create(name: string, slug: string, createdBy: string): void {
    const event: TagCreated = new TagCreated();

    event.payload = {
      name, slug, createdBy
    };

    this.record(event);
  }

  public remove() {
    const event: TagDeleted = new TagDeleted();

    this.record(event)
  }

  public update(name: string, slug) {
    const event: TagUpdated = new TagUpdated();

    event.payload = {
      name, slug
    };

    this.record(event)
  }
}
