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
import { Pagination } from "../../common/pagination";
import { QueryBuilder } from "../../common/helpers/query-builder";
import { InternalServerErrorException } from "@nestjs/common";
import { TransactionTag } from "../models/transaction-tag.model";

@CommandHandler(ListTransactionQuery)
export class ListTransactionQueryHandler implements ICommandHandler<ListTransactionQuery> {

  constructor(
    @InjectModel(Transaction) private readonly transactions: typeof Transaction
  ) {
  }

  async execute(command: ListTransactionQuery): Promise<any> {

    try {
      const transactions = await this.queryTransactions(command);
      return transactions;
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException();
    }
  }

  private async queryTransactions(command: ListTransactionQuery): Promise<Pagination<Transaction>> {
    const query: QueryBuilder<Transaction> = new QueryBuilder<Transaction>(
      Transaction,
      TransactionEntity
    );

    query.where("userId",'=', command.dto.userId);

    if (command.dto.accountId) {
      query.where("accountId", '=', command.dto.accountId);
    }

    if (command.dto.categorySlug) {
      query.where("$category.slug$", '=', command.dto.categorySlug);
    }

    if (command.dto.startDate) {
      query.where("transactionDate", '>=', command.dto.startDate);
    }

    if (command.dto.endDate) {
      query.where("transactionDate", '<=', command.dto.endDate);
    }

    if (command.dto.type) {
      query.where("transactionType", '=', command.dto.type);
    }
    return query.include([
      User,
      Account,
      Tag,
      Category
    ]).order([["transaction_date", "DESC"]])
      .paginate(command.dto.limit, command.dto.page);
  }
}
