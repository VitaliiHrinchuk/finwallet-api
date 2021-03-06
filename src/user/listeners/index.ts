import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { UserCreated } from "../events";
import { UserProjector } from "./user.projector";
import { UserSetup } from "../events/user-setup.event";

export const handlers: HandlersMapNode[] = [
  {
    event: UserCreated,
    handler: UserProjector
  },
  {
    event: UserSetup,
    handler: UserProjector
  }
];
