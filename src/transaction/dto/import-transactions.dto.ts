import { IsEnum, IsIn, IsMimeType, IsNotEmpty, IsOptional, IsUUID, Matches } from "class-validator";
import { TransactionType } from "../domain/transaction.entity";

export class ImportTransactionsDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  //
  @IsMimeType()
  @IsOptional()
  mimetype: string;

  @IsOptional()
  filename: string;

  @IsOptional()
  filepath: string;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType
}
