import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table
} from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Account } from "../../account/models/account.model";
import { Category } from "../../category/models/category.model";
import { UserAccount } from "../../account/models/user-accounts.model";
import { TransactionTag } from "./transaction-tag.model";
import { Tag } from "../../tag/models/tag.model";

@Table({
  timestamps: true,
  tableName: 'transactions'
})
export class Transaction extends Model {

  @Column({ primaryKey: true, autoIncrement: false })
  id: string;

  @Column
  currency: string;

  @Column
  amount: number;

  @Column({field: 'account_currency_amount'})
  accountCurrencyAmount: number;

  @Column({field: 'transaction_type'})
  transactionType: string;

  @Column({field: 'transaction_date'})
  transactionDate: Date;

  @Column
  note: string;

  @Column({field: 'created_at'})
  createdAt: Date;

  @Column({field: 'updated_at'})
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({field: 'user_id'})
  userId: string;

  @ForeignKey(() => Account)
  @Column({field: 'account_id'})
  accountId: string;

  @ForeignKey(() => Category)
  @Column({field: 'category_id'})
  categoryId: string;

  @BelongsTo(() => User)
  user: User

  @BelongsTo(() => Account)
  account: Account

  @BelongsTo(() => Category)
  category: Category

  @BelongsToMany(() => Tag, () => TransactionTag)
  tags: Tag[];

}
