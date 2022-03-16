import { DomainEvent, Projector } from "nest-event-sourcing";
import { UserCreated } from "../events";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/user.model";
import { CqrsModule } from "@nestjs/cqrs";
import { Injectable } from "@nestjs/common";
import { UserSetup } from "../events/user-setup.event";

@Injectable()
export class UserProjector extends Projector {

  constructor(@InjectModel(User) private readonly users: typeof User) {
    super();
  }

  private async loadInstance(event: DomainEvent): Promise<User> {
    const id: string = event.aggregateId;
    return this.users.findByPk(id)
  }


  async applyUserCreated(event: UserCreated) {

    await this.users.create({
      id: event.aggregateId,
      email: event.payload.email,
      passHash: event.payload.password,
    })
  }

  async applyUserSetup(event: UserSetup) {
    const user: User = await this.loadInstance(event);
    console.log('event', event);
    user.baseCurrency = event.payload.baseCurrency;
    user.name = event.payload.name || null;
    user.userConfigured = true;

    await user.save();
  }
}
