import { AggregateRoot } from "nest-event-sourcing";
import { UserCreated } from "../events";
import { v4 as uuidv4 } from 'uuid';
import { UserSetup } from "../events/user-setup.event";

export class UserAggregateRoot extends AggregateRoot {
  public create(email: string, password: string) {
      const event: UserCreated = new UserCreated();
      event.payload = {
        email,
        password,
      };

      this.record(event);
  }

  public setup(name: string, baseCurrency: string) {
    const event: UserSetup = new UserSetup();

    event.payload = {
      name,
      baseCurrency
    }

    this.record(event);
  }
}
