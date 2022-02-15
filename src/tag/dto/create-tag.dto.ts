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

export class CreateTagDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  name: string;

}
