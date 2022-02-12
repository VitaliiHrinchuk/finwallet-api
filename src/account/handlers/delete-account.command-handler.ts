import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { AccountAggregateRoot } from "../domain/account-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { DeleteAccountCommand } from "../commands/delete-account.command";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { AccessDeniedException, EntityNotFoundException } from "../../common/exceptions";

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountCommandHandler implements ICommandHandler<DeleteAccountCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Account) private readonly accounts: typeof Account,
  ) {}

  async execute(command: DeleteAccountCommand): Promise<any> {
    await this.validate(command);

    const account: AccountAggregateRoot = new AccountAggregateRoot(command.dto.id);

    account.remove();

    return this.repository.save(account);
  }

  async validate(command: DeleteAccountCommand): Promise<void> {
    const account = await this.accounts.findOne({
      where: {
        id: command.dto.id
      }
    });

    if (!account) {
      throw new EntityNotFoundException("Account");
    }

    if (account.createdBy != command.dto.userId) {
      throw new AccessDeniedException("You can delete only account created by you")
    }

  }
}
