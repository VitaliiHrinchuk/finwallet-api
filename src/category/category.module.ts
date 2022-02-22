import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { CqrsModule } from "@nestjs/cqrs";
import { EventSourcingModule } from "nest-event-sourcing";
import { Category } from "./models/category.model";
import { eventHandlers, handlersMapNodes } from "./listeners";
import { commandHandlers } from "./handlers";
import { CategoryMatchTypeRule } from "./rules/category-match-type.rule";



@Module({
  imports: [
    SequelizeModule.forFeature([Category]),
    CqrsModule,
    EventSourcingModule.forFeature(handlersMapNodes),
  ],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    CategoryMatchTypeRule
  ],

  controllers: [CategoryController]
})
export class CategoryModule {}
