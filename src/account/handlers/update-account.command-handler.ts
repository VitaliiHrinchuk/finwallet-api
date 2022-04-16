import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { AccountAggregateRoot } from "../domain/account-aggregate-root";
import { v4 as uuidv4 } from 'uuid';
import { UpdateAccountCommand } from "../commands/update-account.command";
import { AccessDeniedException, EntityNotFoundException } from "../../common/exceptions";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { AccountEntity } from "../domain/account.entity";

@CommandHandler(UpdateAccountCommand)
export class UpdateAccountCommandHandler implements ICommandHandler<UpdateAccountCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(Account) private readonly accounts: typeof Account,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<any> {
    await this.validate(command);
    console.log('dto', command.dto);
    const account: AccountAggregateRoot = new AccountAggregateRoot(command.dto.id);

    account.update(
      command.dto.name,
      command.dto.hexColor,
    );

    await this.repository.save(account);

    const newInstance: Account = await this.accounts.findByPk(account.getId());

    return new AccountEntity(newInstance.toJSON());
  }

  async validate(command: UpdateAccountCommand): Promise<void> {
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
