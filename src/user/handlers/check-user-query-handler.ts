import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CheckUserQuery } from "../commands";
import { User } from "../models/user.model";
import { InjectModel } from "@nestjs/sequelize";

@CommandHandler(CheckUserQuery)
export class CheckUserQueryHandler implements ICommandHandler<CheckUserQuery> {

  constructor(@InjectModel(User) private users: typeof User) {}

  async execute(command: CheckUserQuery): Promise<any> {
    return this.users.findOne({
      where: {
        email: command.email
      }
    });
  }
}
