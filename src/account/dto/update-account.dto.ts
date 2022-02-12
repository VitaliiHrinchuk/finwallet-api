import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from "class-validator";

export class UpdateAccountDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @Length(6, 6)
  hexColor: string

  @IsNotEmpty()
  name: string;
}
