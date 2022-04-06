import { IsNotEmpty, IsOptional, IsUUID, Min } from "class-validator";
import { Type } from "class-transformer";

export class ListAccountDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @Type(() => Number)
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;
}
