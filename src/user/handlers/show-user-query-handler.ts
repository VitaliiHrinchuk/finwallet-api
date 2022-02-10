import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ShowUserQuery } from "../commands";
import { User } from "../models/user.model";
import { InjectModel } from "@nestjs/sequelize";
import { UserEntity } from "../domain/user.entity";

@CommandHandler(ShowUserQuery)
export class ShowUserQueryHandler implements ICommandHandler<ShowUserQuery> {

  constructor(@InjectModel(User) private users: typeof User) {}

  async execute(command: ShowUserQuery): Promise<any> {
    const userModel = await this.users.findOne({
      where: {
        id: command.id
      }
    });

    //console.log('new UserEntity(userModel)', new UserEntity(userModel.toJSON()));
    return new UserEntity(userModel.toJSON());
  }
}
