import { Exclude, Type } from "class-transformer";
import { UserEntity } from "../../user/domain/user.entity";

export class CategoryEntity {
  id: string;
  name: string;
  slug: string;
  categoryType: number
  createdAt: Date;
  updatedAt: Date;

  @Type(() => UserEntity)
  owner: UserEntity;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }

  static fromJSON(partial: Partial<CategoryEntity>): CategoryEntity {
    return new CategoryEntity(partial)
  }
}
