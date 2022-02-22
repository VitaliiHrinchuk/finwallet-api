import { Column, DataType, ForeignKey, HasMany, Model, Table } from "sequelize-typescript";
import { Tag } from "../../tag/models/tag.model";
import { Transaction } from "./transaction.model";

@Table({
  timestamps: true,
  tableName: 'transaction_tags'
})
export class TransactionTag extends Model {

  @Column({ primaryKey: true, autoIncrement: false })
  id: string;

  @Column({field: 'created_at'})
  createdAt: Date;

  @Column({field: 'updated_at'})
  updatedAt: Date;

  @ForeignKey(() => Transaction)
  @Column({field: 'transaction_id'})
  transactionId: string;

  @ForeignKey(() => Tag)
  @Column({field: 'tag_id'})
  tagId: string;

}
