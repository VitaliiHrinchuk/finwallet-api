import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Tag } from "../models/tag.model";
import { Op } from "sequelize";

@ValidatorConstraint({ name: 'TagExists', async: true })
@Injectable()
export class TagsExistRule implements ValidatorConstraintInterface {
  constructor(@InjectModel(Tag) private tags: typeof Tag) {}

  async validate(slugs: string[]) {
    try {
      if (slugs.length == 0) {
        return true;
      }
      const tags = await this.tags.findAll({
        where: {
          slug: {
            [Op.or]: slugs
          }
        }
      });

      if (tags.length !== slugs.length) {
        return false
      }
    } catch (e) {
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `One or more tags from field "${args.property}" doesn't exist`;
  }
}
