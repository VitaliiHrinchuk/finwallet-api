import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignUpUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}