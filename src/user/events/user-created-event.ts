import { DomainEvent } from "nest-event-sourcing";

export class UserCreatedEvent extends DomainEvent {
  name = 'UserCreated';
}
