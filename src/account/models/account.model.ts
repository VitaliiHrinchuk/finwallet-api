import { BelongsToMany, Column, DataType, ForeignKey, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "../../user/models/user.model";
import { UserAccount } from "./user-accounts.model";

@Table({
  timestamps: true,
  tableName: 'accounts'
})
export class Account extends Model {

  @Column({ primaryKey: true, autoIncrement: false })
  id: string;

  @Column
  name: string;

  @Column
  amount: number

  @Column
  currency: string

  @Column({ field: 'hex_color'})
  hexColor: string

  @Column({field: 'created_at'})
  createdAt: Date;

  @Column({field: 'updated_at'})
  updatedAt: Date;

  @BelongsToMany(() => User, () => UserAccount)
  users: User[];

  @ForeignKey(() => User)
  @Column({field: 'created_by'})
  createdBy: string;


}
