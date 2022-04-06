import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ImportTransactionsCommand } from "../commands/import-transactions.command";
import { Transaction } from "../models/transaction.model";
import { InjectModel } from "@nestjs/sequelize";
import { EventSourcedRepository } from "nest-event-sourcing";
import { readFileSync } from "fs";
import { readFile } from "fs/promises";
import * as Papa from "papaparse";
import { TransactionAggregateRoot } from "../domain/transaction-aggregate-root";
import { CreateTransactionCommand } from "../commands/create-transaction.command";
import { Account } from "../../account/models/account.model";
import { CurrencyService } from "../../currency/currency.service";
import { User } from "../../user/models/user.model";
import * as moment from "moment";

type CsvTransactionRow = {
  amount: number;
  currency: string;
  category: string;
  date?: string;
}

@CommandHandler(ImportTransactionsCommand)
export class ImportTransactionsCommandHandler implements ICommandHandler<ImportTransactionsCommand> {

  constructor(
    private repository: EventSourcedRepository,
    private currencyService: CurrencyService,
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
    @InjectModel(Account) private readonly accounts: typeof Account,
    @InjectModel(User) private readonly users: typeof User,
  ) {}

  async execute(command: ImportTransactionsCommand): Promise<any> {
    await this.validate(command);

    const file: Buffer = await readFile(`./uploads/${command.dto.filename}` )
    const csvData: string = file.toString();

    const parsedCsv = Papa.parse(csvData, {
      header: true,
      delimiter: ';'
    });

    const formattedData: any[] = parsedCsv.data.filter((item: any) => item.amount && item.currency && item.category);

    for (const key in formattedData) {
      const transaction: TransactionAggregateRoot = new TransactionAggregateRoot();

      const row: CsvTransactionRow = formattedData[key];

      const amountInAccountCurrency = await this.getAccountCurrencyAmount(row.amount, row.currency, command.dto.accountId);
      const amountInBaseCurrency = await  this.getBaseCurrencyAmount(row.amount, row.currency, command.dto.userId);

      const date = row.date
        ? moment(row.date, 'DD.MM.YYYY').toDate()
        : new Date();

      transaction.create(
        row.amount,
        row.currency.toUpperCase(),
        amountInAccountCurrency,
        amountInBaseCurrency,
        command.dto.accountId,
        command.dto.userId,
        row.category,
        command.dto.type.toString(),
        date.toISOString(),
        null,
        []
      );

     await this.repository.save(transaction);
    }

  }

  async getAccountCurrencyAmount(amount: number, currency: string, accountId: string) {
    const account: Account = await this.accounts.findByPk(accountId);

    if (currency == account.currency) {
      return amount;
    }

    return this.currencyService.convert(account.currency, currency, amount);
  }

  async getBaseCurrencyAmount(amount: number, currency: string, userId: string) {
    const user: User = await this.users.findByPk(userId);

    if (currency == user.baseCurrency) {
      return amount;
    }

    return this.currencyService.convert(user.baseCurrency, currency, amount);
  }

  async validate(command: ImportTransactionsCommand): Promise<void> {

  }
}
