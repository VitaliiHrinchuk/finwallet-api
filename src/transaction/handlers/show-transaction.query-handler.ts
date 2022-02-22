import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "../models/transaction.model";
import { TransactionEntity } from "../domain/transaction.entity";
import { User } from "../../user/models/user.model";
import { ShowTransactionQuery } from "../commands/show-transaction.query";
import { Op } from "sequelize";
import { Category } from "../../category/models/category.model";
import { Tag } from "../../tag/models/tag.model";
import { Account } from "../../account/models/account.model";

@CommandHandler(ShowTransactionQuery)
export class ShowTransactionQueryHandler implements ICommandHandler<ShowTransactionQuery> {

  constructor(
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
  ) {}

  async execute(command: ShowTransactionQuery): Promise<any> {

    const transactionsModel = await this.transactions.findOne({
      where: {
        id: command.id,
        userId: command.userId
      },
      include: [
        User,
        Tag,
        Category,
        Account
      ]
    });

    return new TransactionEntity(transactionsModel.toJSON());
  }
}
