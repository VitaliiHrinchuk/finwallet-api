import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";
import { Type } from "class-transformer";
import { TransactionType } from "../../transaction/domain/transaction.entity";
import { AnalyticsType } from "../analytics/analytics-creator";

export class FetchAnalyticsDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsISO8601()
  startDate: string;

  @IsOptional()
  @IsISO8601()
  endDate: string;

  @IsEnum(TransactionType)
  @IsOptional()
  transactionType: TransactionType

  @IsEnum(AnalyticsType)
  @IsNotEmpty()
  type: AnalyticsType
}
