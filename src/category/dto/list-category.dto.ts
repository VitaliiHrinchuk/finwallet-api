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

export class ListCategoryDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsOptional()
  @Length(3, 3)
  categoryType: string
}
