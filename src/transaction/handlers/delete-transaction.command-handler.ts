import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { TransactionAggregateRoot } from "../domain/transaction-aggregate-root";
import { DeleteTransactionCommand } from "../commands/delete-transaction.command";
import { InjectModel } from "@nestjs/sequelize";
import { Transaction } from "../models/transaction.model";
import { EntityNotFoundException } from "../../common/exceptions";
import { TransactionType } from "../domain/transaction.entity";

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionCommandHandler implements ICommandHandler<DeleteTransactionCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Transaction) private readonly transactions: typeof Transaction,
  ) {}

  async execute(command: DeleteTransactionCommand): Promise<any> {
    // await this.validate(command);

    const instance = await this.transactions.findOne({
      where: {
        id: command.dto.id,
        userId: command.dto.userId
      }
    });

    if (!instance) {
      throw new EntityNotFoundException("Transaction");
    }

    const transaction: TransactionAggregateRoot = new TransactionAggregateRoot(command.dto.id);

    transaction.remove(
      TransactionType[instance.transactionType],
      instance.accountCurrencyAmount,
      instance.accountId
    );

    return this.repository.save(transaction);
  }

  async validate(command: DeleteTransactionCommand): Promise<void> {

  }
}
