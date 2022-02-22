import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from "class-validator";

export class ListTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsUUID()
  accountId: string;
}
