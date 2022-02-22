import { Exclude, Type } from "class-transformer";
import { UserEntity } from "../../user/domain/user.entity";
import { AccountEntity } from "../../account/domain/account.entity";
import { CategoryEntity } from "../../category/domain/category.entity";
import { TagEntity } from "../../tag/domain/tag.entity";
import { TransactionTag } from "../models/transaction-tag.model";

export enum TransactionType {
  DEB = "DEB",
  CRE = "CRE"
}

export class TransactionEntity {
  id: string;
  currency: string;
  amount: number;
  accountCurrencyAmount: number;
  transactionType: TransactionType;
  note: string;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => UserEntity)
  user: UserEntity;

  @Type(() => AccountEntity)
  account: AccountEntity;

  @Type(() => CategoryEntity)
  category: CategoryEntity;

  @Type(() => TagEntity)
  tags: TagEntity[] = [];

  @Exclude()
  TransactionTag: any;

  constructor(partial: Partial<TransactionEntity>) {
    Object.assign(this, partial);
  }

  static fromJSON(partial: Partial<TransactionEntity>) {
    return new TransactionEntity(partial)
  }
}
