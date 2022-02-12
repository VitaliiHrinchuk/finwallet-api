import { UpdateAccountDto } from "../dto/update-account.dto";

export class UpdateAccountCommand {
  constructor(
    public readonly dto: UpdateAccountDto
  ) {
  }
}
