import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { UserCreatedEvent } from "../events";
import { UserProjector } from "./user-projector";

export const handlers: HandlersMapNode[] = [
  {
    event: UserCreatedEvent,
    handler: UserProjector
  }
];
