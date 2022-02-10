import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands";
import { EventSourcedRepository } from "nest-event-sourcing";
import { UserAggregateRoot } from "../domain";
import { ValidationException } from "../../common/exceptions";
import * as bcrypt from 'bcrypt';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {

  constructor(private repository: EventSourcedRepository) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const user: UserAggregateRoot = new UserAggregateRoot();

    const passwordHash = await bcrypt.hashSync(command.user.password, 12);

    user.create(
      command.user.email,
      passwordHash,
      command.user.baseCurrency,
      command.user.fullName
    );
    return this.repository.save(user);
  }
}
