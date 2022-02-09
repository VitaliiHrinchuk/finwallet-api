import { Module } from '@nestjs/common';
import { CqrsModule } from "@nestjs/cqrs";
import { commandHandlers } from "./handlers";
import { UserController } from './user.controller';
import { EventSourcingModule } from "nest-event-sourcing";
import { handlers } from "./listeners";
import { User } from "./models/user.model";
import { SequelizeModule } from "@nestjs/sequelize";

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    CqrsModule,
    EventSourcingModule.forFeature(handlers),
  ],
  providers: [
    ...commandHandlers,
    ...handlers.map(handler => handler.handler)
  ],
  controllers: [
    UserController
  ]
})
export class UserModule {}
