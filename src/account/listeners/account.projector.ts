import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Projector } from "nest-event-sourcing";
import { Account } from "../models/account.model";
import { AccountCreated } from "../events/account-created.event";
import { AccountSetUser } from "../events/account-set-user.event";
import { UserAccount } from "../models/user-accounts.model";

@Injectable()
export class AccountProjector extends Projector {

  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
    @InjectModel(UserAccount) private readonly userAccounts: typeof UserAccount
  ) {
    super();
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
}
