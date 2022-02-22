import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Category } from "../models/category.model";
import { ClassConstructor } from "class-transformer";

export function CategoryMatchType(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: CategoryMatchTypeRule,
    });
  };
}

@ValidatorConstraint({ name: 'CategoryMatchType', async: true })
@Injectable()
export class CategoryMatchTypeRule implements ValidatorConstraintInterface {
  constructor(@InjectModel(Category) private categories: typeof Category) {}

  async validate(slug: string, args: ValidationArguments) {
    try {
      const [relatedPropertyName] = args.constraints;
      const typeValue = (args.object as any)[relatedPropertyName];

      const category = await this.categories.findOne({
        where: {
          slug: slug
        }
      });
      if (!category) {
        return false
      }

      if (!category || category.categoryType != typeValue) {
        return false
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    const [constraintProperty] = args.constraints;
    return `Category doesn't exist or ${constraintProperty} and category type does not match`;
  }
}
