import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  isString,
  IsString,
  IsUUID,
  Length,
  MinLength
} from "class-validator";

export class CreateAccountDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @Length(3, 3)
  currency: string

  @IsOptional()
  @Length(6, 6)
  hexColor: string
}
