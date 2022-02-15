import { DeleteTagDto } from "../dto/delete-tag.dto";

export class DeleteTagCommand {
  constructor(
    public readonly dto: DeleteTagDto
  ) {
  }
}
