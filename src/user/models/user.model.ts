import { BelongsTo, BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Account } from "../../account/models/account.model";
import { UserAccount } from "../../account/models/user-accounts.model";
import { Category } from "../../category/models/category.model";
import { Tag } from "../../tag/models/tag.model";

@Table({
  timestamps: true,
  tableName: 'users'
})
export class User extends Model {

  @Column({ primaryKey: true, autoIncrement: false })
  id: string;

  @Column
  email: string;

  @Column({field: 'pass_hash'})
  passHash: string

  @Column
  name: string

  @Column({field: 'base_currency'})
  baseCurrency: string

  @Column({field: 'created_at'})
  createdAt: Date;

  @Column({field: 'updated_at'})
  updatedAt: Date;

  @BelongsToMany(() => Account, () => UserAccount)
  accounts: Account[];

  @HasMany(() => Category)
  categories: Category[];

  @HasMany(() => Tag)
  tags: Tag[];
}
