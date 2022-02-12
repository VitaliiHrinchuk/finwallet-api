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

@Table({
  timestamps: true,
  tableName: 'categories'
})
export class Category extends Model {

  @Column({ primaryKey: true, autoIncrement: false })
  id: string;

  @Column
  name: string;

  @Column
  slug: string;

  @Column({ field: 'category_type'})
  categoryType: string

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
