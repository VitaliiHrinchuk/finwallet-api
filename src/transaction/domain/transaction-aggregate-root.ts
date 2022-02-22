import { AggregateRoot } from "nest-event-sourcing";
import { TransactionCreated } from "../events/transaction-created.event";
import { TransactionDeleted } from "../events/transaction-deleted.event";
import { TransactionUpdated } from "../events/transaction-updated.event";
import { AccountAggregateRoot } from "../../account/domain/account-aggregate-root";
import { TransactionType } from "./transaction.entity";
import { TransactionAmountUpdated } from "../events/transaction-amount-updated.event";

export class TransactionAggregateRoot extends AggregateRoot {
  public create(
    amount: number,
    currency: string,
    accountCurrencyAmount: number,
    accountId: string,
    userId: string,
    categorySlug: string,
    transactionType: string,
    transactionDate: string,
    note: string,
    tags: string[]
  ): void {
    const event: TransactionCreated = new TransactionCreated();

    event.payload = {
      amount,
      currency,
      accountCurrencyAmount,
      accountId,
      userId,
      categorySlug,
      transactionType,
      transactionDate,
      note,
      tags
    };

    this.record(event);

    if (transactionType == TransactionType.CRE.toString()) {
      this.credit(accountCurrencyAmount, accountId);
    } else {
      this.debit(accountCurrencyAmount, accountId);
    }
  }


  public remove(transactionType: TransactionType, accountCurrencyAmount: number, accountId: string) {
    const event: TransactionDeleted = new TransactionDeleted();

    if (transactionType == TransactionType.CRE) {
      this.debit(accountCurrencyAmount, accountId);
    } else {
      this.credit(accountCurrencyAmount, accountId);
    }

    this.record(event)
  }

  public update(categorySlug: string, note: string, transactionDate: string, tags: string[]) {
    const event: TransactionUpdated = new TransactionUpdated();

    event.payload = {
      categorySlug, note, transactionDate, tags
    };

    this.record(event)
  }

  public debit(amount: number, accountId: string) {

    const accountAggregateRoot: AccountAggregateRoot = new AccountAggregateRoot(accountId);

    accountAggregateRoot.debit(amount, this.getId());

    accountAggregateRoot.getRecordedEvents().forEach(event => {
      this.recordedEvents.push(event);
    });
  }

  public credit(amount: number, accountId: string) {
    const accountAggregateRoot: AccountAggregateRoot = new AccountAggregateRoot(accountId);

    accountAggregateRoot.credit(amount, this.getId());

    accountAggregateRoot.getRecordedEvents().forEach(event => {
      this.recordedEvents.push(event);
    });
  }

  public updateAmount(
    oldAmount: number,
    amount: number,
    oldAccountCurrencyAmount: number,
    accountCurrencyAmount: number,
    accountId: string,
    transactionType: TransactionType
  ): void {
    const event: TransactionAmountUpdated = new TransactionAmountUpdated();

    event.payload = {
      oldAmount,
      amount,
      accountCurrencyAmount
    };

    this.record(event);

    if (transactionType == TransactionType.CRE) {
      this.debit(oldAccountCurrencyAmount, accountId);
      this.credit(accountCurrencyAmount, accountId);
    } else {
      this.credit(accountCurrencyAmount, accountId);
      this.debit(oldAccountCurrencyAmount, accountId);
    }
  }
}
