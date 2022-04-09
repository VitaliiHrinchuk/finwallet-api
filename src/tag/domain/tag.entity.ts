import { Exclude, Type } from "class-transformer";
import { UserEntity } from "../../user/domain/user.entity";

export class TagEntity {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;

  @Type(() => UserEntity)
  owner: UserEntity;

  @Exclude()
  TransactionTag: any;

  constructor(partial: Partial<TagEntity>) {
    Object.assign(this, partial);
  }

  static fromJSON(partial: Partial<TagEntity>) {
    return new TagEntity(partial)
  }
}
