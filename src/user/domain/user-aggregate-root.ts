import { AggregateRoot } from "nest-event-sourcing";
import { UserCreatedEvent } from "../events";
import { v4 as uuidv4 } from 'uuid';

export class UserAggregateRoot extends AggregateRoot {
  public create(email: string, password: string, baseCurrency: string, fullName: string) {
      const event: UserCreatedEvent = new UserCreatedEvent();
      // const id = uuidv4();
      // this.id = id;
      event.payload = {
      //  id,
        email,
        password,
        baseCurrency,
        fullName
      };

      this.record(event);
  }
}
