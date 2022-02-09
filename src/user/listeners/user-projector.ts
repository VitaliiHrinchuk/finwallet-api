import { Projector } from "nest-event-sourcing";
import { UserCreatedEvent } from "../events";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/user.model";
import { CqrsModule } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserProjector extends Projector {

  constructor(@InjectModel(User) private readonly users: typeof User) {
    super();
  }

  async applyUserCreated(event: UserCreatedEvent) {
    console.log('event', event);

    await this.users.create({
      id: event.aggregateId,
      email: event.payload.email,
      passHash: event.payload.password,
      baseCurrency: event.payload.baseCurrency,
      name: event.payload.fullName
    })
  }
}
