import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ListTransactionQuery } from "../commands/list-transaction.query";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "../models/transaction.model";
import { User } from "../../user/models/user.model";
import { TransactionEntity } from "../domain/transaction.entity";
import { Op } from "sequelize";
import { Account } from "../../account/models/account.model";
import { Tag } from "../../tag/models/tag.model";
import { Category } from "../../category/models/category.model";

@CommandHandler(ListTransactionQuery)
export class ListTransactionQueryHandler implements ICommandHandler<ListTransactionQuery> {

  constructor(
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
    ) {}

  async execute(command: ListTransactionQuery): Promise<any> {

    const transactions = await this.queryTransactions(command);

    return transactions.map(model => new TransactionEntity(model.toJSON()));
  }

  private async queryTransactions(command: ListTransactionQuery): Promise<Transaction[]> {
    return this.transactions.findAll({
      where: {
        userId: command.dto.userId
      },
      include: [
        User,
        Account,
        Tag,
        Category
      ],
      order: [
        ['transaction_date', 'DESC']
      ]
    })
  }
}