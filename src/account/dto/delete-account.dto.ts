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

export class DeleteAccountDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  id: string;

}
