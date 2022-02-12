import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { AccountCreated } from "../events/account-created.event";
import { AccountProjector } from "./account.projector";
import { AccountSetUser } from "../events/account-set-user.event";
import { AccountDeleted } from "../events/account-deleted.event";
import { AccountUpdated } from "../events/account-updated.event";

export const handlersMapNodes: HandlersMapNode[] = [
  {
    event: AccountCreated,
    handler: AccountProjector
  },
  {
    event: AccountSetUser,
    handler: AccountProjector
  },
  {
    event: AccountDeleted,
    handler: AccountProjector
  },
  {
    event: AccountUpdated,
    handler: AccountProjector
  }
];

export const eventHandlers = [AccountProjector];
