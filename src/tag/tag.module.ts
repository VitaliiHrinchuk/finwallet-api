import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { CqrsModule } from "@nestjs/cqrs";
import { EventSourcingModule } from "nest-event-sourcing";
import { Tag } from "./models/tag.model";
import { eventHandlers, handlersMapNodes } from "./listeners";
import { commandHandlers } from "./handlers";
import { TagController } from './tag.controller';
import { TagsExistRule } from "./rules/tags-exist.rule";

@Module({
  imports: [
    SequelizeModule.forFeature([Tag]),
    CqrsModule,
    EventSourcingModule.forFeature(handlersMapNodes),
  ],
  providers: [
    ...commandHandlers,
    ...eventHandlers,
    TagsExistRule
  ],
  controllers: [TagController],
})
export class TagModule {}
