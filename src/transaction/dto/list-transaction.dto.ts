import {
  IsEnum,
  IsISO8601,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsUUID,
  Length, Min
} from "class-validator";
import { Type } from "class-transformer";
import { TransactionType } from "../domain/transaction.entity";

export class ListTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  accountId: string;

  @IsOptional()
  categorySlug: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
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
