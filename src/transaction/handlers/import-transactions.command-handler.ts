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
  ) {}

  async execute(command: ImportTransactionsCommand): Promise<any> {
    await this.validate(command);

    const file: Buffer = await readFile(`./uploads/${command.dto.filename}` )
    const csvData: string = file.toString();

    const parsedCsv = Papa.parse(csvData, {
      header: true,
      delimiter: ';'
    });
    // console.log('p', parsedCsv);

    const formattedData: any[] = parsedCsv.data.filter((item: any) => item.amount && item.currency && item.category);



    for (const key in formattedData) {
      const transaction: TransactionAggregateRoot = new TransactionAggregateRoot();

      const row: CsvTransactionRow = formattedData[key];

      const amountInAccountCurrency = await this.getAccountCurrencyAmount(row.amount, row.currency, command.dto.accountId);

      const date = row.date
        ? new Date(row.date)
        : new Date();

      transaction.create(
        row.amount,
        row.currency.toUpperCase(),
        amountInAccountCurrency,
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


    //
    // const instance = await this.transactions.findOne({
    //   where: {
    //     id: command.dto.id,
    //     userId: command.dto.userId
    //   }
    // });
    //
    // if (!instance) {
    //   throw new EntityNotFoundException("Transaction");
    // }
    //
    // const transaction: TransactionAggregateRoot = new TransactionAggregateRoot(command.dto.id);
    //
    // transaction.remove(
    //   TransactionType[instance.transactionType],
    //   instance.accountCurrencyAmount,
    //   instance.accountId
    // );

    // return this.repository.save(transaction);
  }

  async getAccountCurrencyAmount(amount: number, currency: string, accountId: string) {
    const account: Account = await this.accounts.findByPk(accountId);

    if (currency == account.currency) {
      return amount;
    }

    return this.currencyService.convert(account.currency, currency, amount);
  }


  async validate(command: ImportTransactionsCommand): Promise<void> {

  }
}
