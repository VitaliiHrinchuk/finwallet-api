import { IsNotEmpty, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class SetupUserDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  baseCurrency: string;
}
