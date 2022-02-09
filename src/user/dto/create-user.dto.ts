import { IsEmail, IsNotEmpty, IsString, Length, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @Length(3, 3)
  baseCurrency: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;
}
