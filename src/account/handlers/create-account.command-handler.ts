import { CreateAccountCommand } from "../commands/create-account.command";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { AccountAggregateRoot } from "../domain/account-aggregate-root";
import { v4 as uuidv4 } from 'uuid';

@CommandHandler(CreateAccountCommand)
export class CreateAccountCommandHandler implements ICommandHandler<CreateAccountCommand> {

  constructor(private repository: EventSourcedRepository) {}

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

    return this.repository.save(account);
  }
}
