import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { CategoryCreated } from "../events/category-created.event";
import { CategoryProjector } from "./category.projector";
import { CategoryDeleted } from "../events/category-deleted.event";
import { CategoryUpdated } from "../events/category-updated.event";

export const handlersMapNodes: HandlersMapNode[] = [
  {
    event: CategoryCreated,
    handler: CategoryProjector
  },
  {
    event: CategoryDeleted,
    handler: CategoryProjector
  },
  {
    event: CategoryUpdated,
    handler: CategoryProjector
  }
];

export const eventHandlers = [CategoryProjector];
