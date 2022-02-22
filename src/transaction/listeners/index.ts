import { HandlersMapNode } from "nest-event-sourcing/dist/module/interfaces";
import { TransactionCreated } from "../events/transaction-created.event";
import { TransactionProjector } from "./transaction.projector";
import { TransactionDeleted } from "../events/transaction-deleted.event";
import { TransactionUpdated } from "../events/transaction-updated.event";
import { TransactionAmountUpdated } from "../events/transaction-amount-updated.event";

export const handlersMapNodes: HandlersMapNode[] = [
  {
    event: TransactionCreated,
    handler: TransactionProjector
  },
  {
    event: TransactionDeleted,
    handler: TransactionProjector
  },
  {
    event: TransactionUpdated,
    handler: TransactionProjector
  },
  {
    event: TransactionAmountUpdated,
    handler: TransactionProjector
  }
];

export const eventHandlers = [TransactionProjector];
