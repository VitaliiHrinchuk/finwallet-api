import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Length,
} from "class-validator";

export class UpdateTagDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  name: string;
}
