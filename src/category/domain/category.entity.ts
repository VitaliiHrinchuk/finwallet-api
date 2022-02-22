import { Exclude, Type } from "class-transformer";
import { UserEntity } from "../../user/domain/user.entity";

export enum CategoryType {
  DEB,
  CRE
}

export class CategoryEntity {
  id: string;
  name: string;
  slug: string;
  categoryType: CategoryType;
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
