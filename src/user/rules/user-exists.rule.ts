import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "../models/user.model";

@ValidatorConstraint({ name: 'UserExists', async: true })
@Injectable()
export class UserExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectModel(User) private users: typeof User) {}

  async validate(id: string) {
    try {
      const user = await this.users.findByPk(id);
      if (!user) {
        return false
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `User doesn't exist`;
  }
}
