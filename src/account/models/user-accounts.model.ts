import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { Account } from "./account.model";

@Table({
  timestamps: true,
  tableName: 'user_accounts'
})
export class UserAccount extends Model {

  @Column({ primaryKey: true, autoIncrement: false })
  id: string;

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

}
