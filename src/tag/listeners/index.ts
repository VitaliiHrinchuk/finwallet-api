import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { TagCreated } from "../events/tag-created.event";
import { TagProjector } from "./tag.projector";
import { TagDeleted } from "../events/tag-deleted.event";
import { TagUpdated } from "../events/tag-updated.event";

export const handlersMapNodes: HandlersMapNode[] = [
  {
    event: TagCreated,
    handler: TagProjector
  },
  {
    event: TagDeleted,
    handler: TagProjector
  },
  {
    event: TagUpdated,
    handler: TagProjector
  }
];

export const eventHandlers = [TagProjector];
