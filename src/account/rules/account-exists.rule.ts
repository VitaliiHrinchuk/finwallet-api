import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";

@ValidatorConstraint({ name: 'AccountExists', async: true })
@Injectable()
export class AccountExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectModel(Account) private accounts: typeof Account) {}

  async validate(id: string) {
    try {

      const account = await this.accounts.findByPk(id);
      if (!account) {
        return false
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Account doesn't exist`;
  }
}
