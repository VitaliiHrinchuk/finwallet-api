import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { AccountCreated } from "../events/account-created.event";
import { AccountProjector } from "./account.projector";
import { AccountSetUser } from "../events/account-set-user.event";
import { AccountDeleted } from "../events/account-deleted.event";
import { AccountUpdated } from "../events/account-updated.event";
import { AccountCredited } from "../events/account-credited.event";
import { AccountDebited } from "../events/account-debited.event";

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
  },
  {
    event: AccountCredited,
    handler: AccountProjector
  },
  {
    event: AccountDebited,
    handler: AccountProjector
  }
];

export const eventHandlers = [AccountProjector];
