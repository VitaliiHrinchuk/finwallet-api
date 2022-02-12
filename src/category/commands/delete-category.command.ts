import { DeleteCategoryDto } from "../dto/delete-category.dto";

export class DeleteCategoryCommand {
  constructor(
    public readonly dto: DeleteCategoryDto
  ) {
  }
}
