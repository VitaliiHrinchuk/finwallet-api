import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Account } from "./models/account.model";
import { CqrsModule } from "@nestjs/cqrs";
import { UserAccount } from "./models/user-accounts.model";
import { AccountController } from './account.controller';
import { commandHandlers } from "./handlers";
import { EventSourcingModule } from "nest-event-sourcing";
import { eventHandlers, handlersMapNodes } from "./listeners";

@Module({
  imports: [
    SequelizeModule.forFeature([Account, UserAccount]),
    CqrsModule,
    EventSourcingModule.forFeature(handlersMapNodes),
  ],
  providers: [
    ...commandHandlers,
    ...eventHandlers
  ],

  controllers: [AccountController]
})
export class AccountModule {}
