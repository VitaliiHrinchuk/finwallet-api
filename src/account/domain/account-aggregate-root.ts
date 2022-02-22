import { AggregateRoot } from "nest-event-sourcing";
import { AccountCreated } from "../events/account-created.event";
import { AccountSetUser } from "../events/account-set-user.event";
import { AccountDeleted } from "../events/account-deleted.event";
import { AccountUpdated } from "../events/account-updated.event";
import { AccountDebited } from "../events/account-debited.event";
import { AccountCredited } from "../events/account-credited.event";

export class AccountAggregateRoot extends AggregateRoot {
  public create(name: string, amount: number, currency: string, createdBy: string, hexColor?: string): void {
    const event: AccountCreated = new AccountCreated();

    event.payload = {
      name, amount, currency, createdBy, hexColor
    };

    this.record(event);
  }

  public setAccountUser(id: string, userId: string): void {
    const event: AccountSetUser = new AccountSetUser();

    event.payload = {
      id,
      userId
    };

    this.record(event);
  }

  public remove() {
    const event: AccountDeleted = new AccountDeleted();

    this.record(event)
  }

  public update(name: string, hexColor?: string) {
    const event: AccountUpdated = new AccountUpdated();

    event.payload = {
      name, hexColor
    };

    this.record(event)
  }

  public debit(amount: number, transactionId: string) {
    const event: AccountDebited = new AccountDebited();

    event.payload = {
      amount,
      transactionId
    };

    this.record(event)
  }

  public credit(amount: number, transactionId: string) {
    const event: AccountCredited = new AccountCredited();

    event.payload = {
      amount,
      transactionId
    };

    this.record(event)
  }
}
