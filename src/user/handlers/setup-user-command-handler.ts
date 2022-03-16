import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { EventSourcedRepository } from "nest-event-sourcing";
import { UserAggregateRoot } from "../domain";
import { EntityNotFoundException, ValidationException } from "../../common/exceptions";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/user.model";
import { SetupUserCommand } from "../commands/setup-user-command";
import { UserEntity } from "../domain/user.entity";

@CommandHandler(SetupUserCommand)
export class SetupUserCommandHandler implements ICommandHandler<SetupUserCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(User) private users: typeof User
  ) {}

  async execute(command: SetupUserCommand): Promise<any> {
    const user: UserAggregateRoot = new UserAggregateRoot(command.dto.userId);

    const userInstance = await this.users.findOne({
      where: {
        id: command.dto.userId
      }
    });

    if (!userInstance) {
      throw new EntityNotFoundException('User');
    }

    if (userInstance.userConfigured) {
      throw new ValidationException([], "User account already configured")
    }

    user.setup(
      command.dto.fullName,
      command.dto.baseCurrency
    );

    await this.repository.save(user);

    const updatedUser: User = await userInstance.reload();

    return new UserEntity(updatedUser.toJSON());
  }
}
