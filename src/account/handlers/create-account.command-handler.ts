import { CreateAccountCommand } from "../commands/create-account.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { AccountAggregateRoot } from "../domain/account-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { AccountEntity } from "../domain/account.entity";

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Account) private readonly accounts: typeof Account,
  ) {}

  async execute(command: CreateAccountCommand): Promise<any> {
    const account: AccountAggregateRoot = new AccountAggregateRoot();

    account.create(
      command.account.name,
      command.account.amount,
      command.account.currency,
      command.account.userId,
      command.account.hexColor
    );

    account.setAccountUser(uuidv4(), command.account.userId);

    await this.repository.save(account);

    const newInstance: Account = await  this.accounts.findByPk(account.getId());

    return new AccountEntity(newInstance.toJSON());
  }
}
