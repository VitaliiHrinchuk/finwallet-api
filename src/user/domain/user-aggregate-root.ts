import { AggregateRoot } from "nest-event-sourcing";
import { UserCreated } from "../events";
import { v4 as uuidv4 } from 'uuid';

export class UserAggregateRoot extends AggregateRoot {
  public create(email: string, password: string, baseCurrency: string, fullName: string) {
      const event: UserCreated = new UserCreated();
      event.payload = {
        email,
        password,
        baseCurrency,
        fullName
      };

      this.record(event);
  }
}
