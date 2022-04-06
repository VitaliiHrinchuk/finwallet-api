import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { ListAccountsQuery } from "../commands/list-accounts.query";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { UserAccount } from "../models/user-accounts.model";
import { AccountEntity } from "../domain/account.entity";
import { User } from "../../user/models/user.model";
import { Pagination } from "../../common/pagination";
import { Transaction } from "../../transaction/models/transaction.model";
import { QueryBuilder } from "../../common/helpers/query-builder";
import { TransactionEntity } from "../../transaction/domain/transaction.entity";
import { Tag } from "../../tag/models/tag.model";
import { Category } from "../../category/models/category.model";
import { InternalServerErrorException } from "@nestjs/common";

@CommandHandler(ListAccountsQuery)
export class ListAccountsQueryHandler implements ICommandHandler<ListAccountsQuery> {

  constructor(
    @InjectModel(Account) private readonly accounts: typeof Account,
    ) {}

  async execute(command: ListAccountsQuery): Promise<any> {

    try {
      return this.queryAccounts(command);
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException();
    }
  }

  async queryAccounts(command: ListAccountsQuery): Promise<Pagination<AccountEntity>> {
    const query: QueryBuilder<Account> = new QueryBuilder<Account>(
      Account,
      AccountEntity
    );

    query.where("$users.id$",'=', command.dto.userId);

    return query.include([
      User,
    ]).order([["updatedAt", "DESC"]])
      .paginate(command.dto.limit, command.dto.page);
  }
}
