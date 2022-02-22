import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Account } from "../models/account.model";
import { UserAccount } from "../models/user-accounts.model";

export function IsAccountOwner(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsAccountOwnerRule,
    });
  };
}

@ValidatorConstraint({ name: 'IsAccountOwner', async: true })
@Injectable()
export class IsAccountOwnerRule implements ValidatorConstraintInterface {
  constructor(@InjectModel(UserAccount) private userAccounts: typeof UserAccount) {}

  async validate(accountId: string, args: ValidationArguments) {
    try {
      const [relatedPropertyName] = args.constraints;
      const userId = (args.object as any)[relatedPropertyName];

      const account = await this.userAccounts.findOne({
        where: {
          userId: userId,
          accountId: accountId
        }
      });
      if (!account) {
        return false
      }

    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `Account doesn't exist or you have no access to it`;
  }
}
