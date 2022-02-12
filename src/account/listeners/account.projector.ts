import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { DomainEvent, Projector } from "nest-event-sourcing";
import { Account } from "../models/account.model";
import { AccountCreated } from "../events/account-created.event";
import { AccountSetUser } from "../events/account-set-user.event";
import { UserAccount } from "../models/user-accounts.model";
import { AccountDeleted } from "../events/account-deleted.event";
import { AccountUpdated } from "../events/account-updated.event";

@Injectable()
export class AccountProjector extends Projector {

  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
    @InjectModel(UserAccount) private readonly userAccounts: typeof UserAccount
  ) {
    super();
  }

  private async loadInstance(event: DomainEvent): Promise<Account> {
      const id: string = event.aggregateId;
      return this.accounts.findByPk(id)
  }

  async applyAccountCreated(event: AccountCreated) {
    await this.accounts.create({
      id: event.aggregateId,
      name: event.payload.name,
      amount: event.payload.amount,
      currency: event.payload.currency,
      createdBy: event.payload.createdBy,
      hexColor: event.payload.hexColor,
    })
  }

  async applyAccountSetUser(event: AccountSetUser) {
    await this.userAccounts.create({
      id: event.payload.id,
      userId: event.payload.userId,
      accountId: event.aggregateId,
    })
  }

  async applyAccountDeleted(event: AccountDeleted) {
    await this.userAccounts.destroy({
      where: {
        accountId: event.aggregateId
      }
    })
    await this.accounts.destroy({
      where: {
        id: event.aggregateId
      }
    })
  }

  async applyAccountUpdated(event: AccountUpdated) {
    const account: Account = await this.loadInstance(event);

    account.name = event.payload.name;
    account.hexColor = event.payload.hexColor;

    await account.save();
  }
}
