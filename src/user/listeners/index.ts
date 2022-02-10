import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { UserCreated } from "../events";
import { UserProjector } from "./user.projector";

export const handlers: HandlersMapNode[] = [
  {
    event: UserCreated,
    handler: UserProjector
  }
];
