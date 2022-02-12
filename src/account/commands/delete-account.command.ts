import { DeleteAccountDto } from "../dto/delete-account.dto";

export class DeleteAccountCommand {
  constructor(
    public readonly dto: DeleteAccountDto
  ) {
  }
}
