import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { UserAccount } from "../models/user-accounts.model";
import { AccountEntity } from "../domain/account.entity";
import { User } from "../../user/models/user.model";
import { ShowAccountQuery } from "../commands/show-account.query";

@CommandHandler(ShowAccountQuery)
export class ShowAccountQueryHandler implements ICommandHandler<ShowAccountQuery> {

  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
  ) {}

  async execute(command: ShowAccountQuery): Promise<any> {

    const accountModel = await this.accounts.findOne({
      where: {
        id: command.id,
        createdBy: command.userId
      },
      include: [
        {
          model: User,
        }
      ]
    });

    return new AccountEntity(accountModel.toJSON());
  }
}
