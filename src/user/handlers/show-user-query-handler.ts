import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ShowUserQuery } from "../commands";
import { User } from "../models/user.model";
import { InjectModel } from "@nestjs/sequelize";

@CommandHandler(ShowUserQuery)
export class ShowUserQueryHandler implements ICommandHandler<ShowUserQuery> {

  constructor(@InjectModel(User) private users: typeof User) {}

  async execute(command: ShowUserQuery): Promise<any> {
    return this.users.findOne({
      where: {
        id: command.id
      }
    });
  }
}
