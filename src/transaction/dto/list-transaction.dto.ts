import {
  IsNotEmpty, IsNumber,
  IsOptional,
  IsUUID,
  Length, Min
} from "class-validator";
import { Type } from "class-transformer";

export class ListTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  accountId: string;

  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;
}
