import {
  IsArray,
  IsEnum, IsIn,
  IsISO8601,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsUUID,
  Length, Min, ValidateIf
} from "class-validator";
import { Type } from "class-transformer";
import { TransactionType } from "../domain/transaction.entity";
import { IsNullable } from "../../common/rules/is-nullable";


export class ListTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  accounts: string[];

  @IsOptional()
  categories: string[];

  @IsOptional()
  @IsIn(["CRE", "DEB"])
  type: TransactionType

  @IsOptional()
  @IsISO8601()
  startDate: string;

  @IsOptional()
  @IsISO8601()
  endDate: string;

  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;
}
