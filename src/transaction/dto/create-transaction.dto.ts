import {
  IsArray,
  IsDate, IsDateString,
  IsEmail, IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
  IsUUID,
  Length,
  MinLength, Validate
} from "class-validator";
import { TransactionType } from "../domain/transaction.entity";
import { AccountExistsRule } from "../../account/rules/account-exists.rule";
import { CategoryMatchType, CategoryMatchTypeRule } from "../../category/rules/category-match-type.rule";
import { TagsExistRule } from "../../tag/rules/tags-exist.rule";
import { IsAccountOwner } from "../../account/rules/is-account-owner.rule";

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  @IsAccountOwner('userId')
  accountId: string;

  @IsNotEmpty()
  @CategoryMatchType('type')
  categorySlug: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType

  @IsString()
  @IsOptional()
  note: string;

  @IsDateString()
  @IsOptional()
  date: Date;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  @Validate(TagsExistRule)
  tags: string[];

}
