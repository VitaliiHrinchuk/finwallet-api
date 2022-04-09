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
import { TransactionTag } from "../../transaction/models/transaction-tag.model";
import { Transaction } from "../../transaction/models/transaction.model";

@Table({
  timestamps: true,
  tableName: 'tags'
})
export class Tag extends Model {

  @Column({ primaryKey: true, autoIncrement: false })
  id: string;

  @Column
  name: string;

  @Column
  slug: string;

  @Column({field: 'created_at'})
  createdAt: Date;

  @Column({field: 'updated_at'})
  updatedAt: Date;

  @ForeignKey(() => User)
  @Column({field: 'created_by'})
  createdBy: string;

  @BelongsTo(() => User)
  owner: User

}
