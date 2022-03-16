import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "../commands";
import { EventSourcedRepository } from "nest-event-sourcing";
import { UserAggregateRoot } from "../domain";
import { ValidationException } from "../../common/exceptions";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/user.model";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {

  constructor(
    private repository: EventSourcedRepository,
    @InjectModel(User) private users: typeof User
  ) {}

  async execute(command: CreateUserCommand): Promise<any> {
    const user: UserAggregateRoot = new UserAggregateRoot();

    const existedUser = await this.users.findOne({
      where: {
        email: command.user.email
      }
    });

    if (!!existedUser) {
      throw new ValidationException([], "User with this email already exists");
    }

    const passwordHash = await bcrypt.hashSync(command.user.password, 12);

    user.create(
      command.user.email,
      passwordHash
    );
    return this.repository.save(user);
  }
}
