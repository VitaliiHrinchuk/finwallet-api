import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";

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
  //
  // @HasMany(() => Budget)
  // budgets: Budget[];
}
