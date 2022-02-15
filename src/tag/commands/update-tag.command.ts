import { UpdateTagDto } from "../dto/update-tag.dto";

export class UpdateTagCommand {
  constructor(
    public readonly dto: UpdateTagDto
  ) {
  }
}
