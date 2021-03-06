import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Account } from "./models/account.model";
import { CqrsModule } from "@nestjs/cqrs";
import { UserAccount } from "./models/user-accounts.model";
import { AccountController } from './account.controller';
import { commandHandlers } from "./handlers";
import { EventSourcingModule } from "nest-event-sourcing";
import { eventHandlers, handlersMapNodes } from "./listeners";
import { AccountExistsRule } from "./rules/account-exists.rule";
import { IsAccountOwnerRule } from "./rules/is-account-owner.rule";
import { Transaction } from "../transaction/models/transaction.model";
import { AnalyticsCreator } from "./analytics/analytics-creator";

@Module({
  imports: [
    SequelizeModule.forFeature([Account, UserAccount, Transaction]),
    CqrsModule,
    EventSourcingModule.forFeature(handlersMapNodes),
  ],
  providers: [
    AnalyticsCreator,
    ...commandHandlers,
    ...eventHandlers,
    AccountExistsRule,
    IsAccountOwnerRule
  ],

  controllers: [AccountController]
})
export class AccountModule {}
