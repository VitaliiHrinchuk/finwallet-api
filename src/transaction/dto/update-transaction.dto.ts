import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty, IsNumber,
  IsOptional, IsString,
  IsUUID,
  Length, Validate
} from "class-validator";
import { IsAccountOwner } from "../../account/rules/is-account-owner.rule";
import { CategoryMatchType } from "../../category/rules/category-match-type.rule";
import { TransactionType } from "../domain/transaction.entity";
import { TagsExistRule } from "../../tag/rules/tags-exist.rule";

export class UpdateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  categorySlug: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsDateString()
  @IsOptional()
  date: string;

  @IsArray()
  @IsString({each: true})
  @IsOptional()
  @Validate(TagsExistRule)
  tags: string[];
}
