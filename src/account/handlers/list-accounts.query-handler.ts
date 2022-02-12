import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ListAccountsQuery } from "../commands/list-accounts.query";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { UserAccount } from "../models/user-accounts.model";
import { AccountEntity } from "../domain/account.entity";
import { User } from "../../user/models/user.model";

@CommandHandler(ListAccountsQuery)
export class ListAccountsQueryHandler implements ICommandHandler<ListAccountsQuery> {

  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
    ) {}

  async execute(command: ListAccountsQuery): Promise<any> {
    const accountModels = await this.accounts.findAll({
      include: [
        {
          model: User,
          where: {
            id: command.userId
          }
        }
      ]
    });

    return accountModels.map(model => new AccountEntity(model.toJSON()));
  }
}
