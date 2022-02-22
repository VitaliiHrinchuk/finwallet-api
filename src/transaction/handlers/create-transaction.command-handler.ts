import { CreateTransactionCommand } from "../commands/create-transaction.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { TransactionAggregateRoot } from "../domain/transaction-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "../models/transaction.model";
import { ValidationException } from "../../common/exceptions";
import { strToSnakeCase } from "../../common/helpers/str-to-snake-case";
import { TransactionEntity } from "../domain/transaction.entity";
import { Account } from "../../account/models/account.model";
import { User } from "../../user/models/user.model";
import { CurrencyService } from "../../currency/currency.service";
import { dateToPgdate } from "../../common/helpers/date-to-pgdate";
import { Category } from "../../category/models/category.model";
import { Tag } from "../../tag/models/tag.model";

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionCommandHandler implements ICommandHandler<CreateTransactionCommand> {

  constructor(
    private repository: EventSourcedRepository,
    private currencyService: CurrencyService,
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
    @InjectModel(Account) private readonly accounts: typeof Account,
  ) {}

  async execute(command: CreateTransactionCommand): Promise<any> {

    const transaction: TransactionAggregateRoot = new TransactionAggregateRoot();

    const amountInAccountCurrency = await this.getAccountCurrencyAmount(command);
    const date = command.dto.date
      ? command.dto.date
      : new Date();

    transaction.create(
      command.dto.amount,
      command.dto.currency.toUpperCase(),
      amountInAccountCurrency,
      command.dto.accountId,
      command.dto.userId,
      command.dto.categorySlug,
      command.dto.type.toString(),
      date.toISOString(),
      command.dto.note,
      command.dto.tags
    );

    await this.repository.save(transaction);

    const instance: Transaction = await this.transactions.findByPk(transaction.getId(), {
      include: [
        User, Account, Category, Tag
      ]
    });

    return TransactionEntity.fromJSON(instance.toJSON());
  }

  async getAccountCurrencyAmount(command: CreateTransactionCommand) {
    const account: Account = await this.accounts.findByPk(command.dto.accountId);

    if (command.dto.currency == account.currency) {
      return command.dto.amount;
    }

    return this.currencyService.convert(account.currency, command.dto.currency, command.dto.amount);
  }

  async validate(command: CreateTransactionCommand): Promise<void> {
    // const user: User = await this.transactions.findOne({
    //   where: {
    //     slug: slug
    //   }
    // });
    //
    // if (!!category) {
    //   throw new ValidationException([{field: 'name', message: 'tag with this name already exists'}])
    // }
  }

}
