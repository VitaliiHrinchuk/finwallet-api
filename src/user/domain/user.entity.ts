import { Exclude, Type } from "class-transformer";
import { AccountEntity } from "../../account/domain/account.entity";

export class UserEntity {
  id: string;
  email: string;
  name: string;
  baseCurrency: string;

  @Exclude()
  passHash: string;

  @Type(() => AccountEntity)
  accounts: AccountEntity[] = [];

  @Exclude()
  UserAccount: any;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
