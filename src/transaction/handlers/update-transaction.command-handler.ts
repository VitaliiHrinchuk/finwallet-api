import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { TransactionAggregateRoot } from "../domain/transaction-aggregate-root";
import { UpdateTransactionCommand } from "../commands/update-transaction.command";
import { EntityNotFoundException } from "../../common/exceptions";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "../models/transaction.model";
import { TransactionEntity, TransactionType } from "../domain/transaction.entity";
import { User } from "../../user/models/user.model";
import { Tag } from "../../tag/models/tag.model";
import { Category } from "../../category/models/category.model";
import { Account } from "../../account/models/account.model";
import { CurrencyService } from "../../currency/currency.service";

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionCommandHandler implements ICommandHandler<UpdateTransactionCommand> {

  constructor(
    private repository: EventSourcedRepository,
    private currencyService: CurrencyService,
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
    @InjectModel(Account) private readonly accounts: typeof Account,
  ) {}

  async execute(command: UpdateTransactionCommand): Promise<any> {
    await this.validate(command);

    const instance: Transaction = await this.transactions.findOne({
      where: {
        id: command.dto.id,
        userId: command.dto.userId
      },
      include: [
        Account
      ]
    });

    if (!instance) {
      throw new EntityNotFoundException("Transaction");
    }

    const transaction: TransactionAggregateRoot = new TransactionAggregateRoot(instance.id);

    transaction.update(
      command.dto.categorySlug,
      command.dto.note,
      command.dto.date,
      command.dto.tags
    );

    if (command.dto.amount && command.dto.amount != instance.amount) {
      const amountInAccountCurrency = await this.currencyService.convert(
        instance.account.currency,
        instance.currency,
        command.dto.amount
      );

      transaction.updateAmount(
        instance.amount,
        command.dto.amount,
        instance.accountCurrencyAmount,
        amountInAccountCurrency,
        instance.accountId,
        TransactionType[instance.transactionType]
      );
    }

    await this.repository.save(transaction);

    const updatedInstance: Transaction = await instance.reload({
      include: [
        User,
        Tag,
        Category,
        Account
      ]
    });

    return TransactionEntity.fromJSON(updatedInstance.toJSON());
  }

  async validate(command: UpdateTransactionCommand): Promise<void> {
    // const transaction = await this.transactions.findOne({
    //   where: {
    //     id: command.dto.id,
    //     createdBy: command.dto.userId
    //   }
    // });
    //
    // if (!transaction) {
    //   throw new EntityNotFoundException("Tag");
    // }

  }


}
