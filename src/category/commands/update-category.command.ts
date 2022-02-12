import { UpdateCategoryDto } from "../dto/update-category.dto";

export class UpdateCategoryCommand {
  constructor(
    public readonly dto: UpdateCategoryDto
  ) {
  }
}
