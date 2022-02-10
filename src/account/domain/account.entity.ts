import { Type } from "class-transformer";
import { UserEntity } from "../../user/domain/user.entity";

export class AccountEntity {
  id: string;
  name: string;
  amount: number
  currency: string
  hexColor: string
  createdAt: Date;
  updatedAt: Date;

  @Type(() => UserEntity)
  users: UserEntity[] = [];

  @Type(() => UserEntity)
  createdBy: UserEntity;
}
