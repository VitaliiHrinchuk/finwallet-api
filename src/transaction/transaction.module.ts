import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CqrsModule } from "@nestjs/cqrs";
import { EventSourcingModule } from "nest-event-sourcing";
import { Transaction } from "./models/transaction.model";
import { eventHandlers, handlersMapNodes } from "./listeners";
import { commandHandlers } from "./handlers";
import { TransactionController } from "./transaction.controller";
import { CurrencyModule } from "../currency/currency.module";
import { Account } from "../account/models/account.model";
import { Category } from "../category/models/category.model";
import { TransactionTag } from "./models/transaction-tag.model";
import { Tag } from "../tag/models/tag.model";


@Module({
  imports: [
    SequelizeModule.forFeature([
      Transaction,
      Account,
      Category,
      TransactionTag,
      Tag
    ]),
    CqrsModule,
    EventSourcingModule.forFeature(handlersMapNodes),
    CurrencyModule
  ],
  providers: [
    ...commandHandlers,
    ...eventHandlers
  ],
  controllers: [TransactionController]
})
export class TransactionModule {
}
