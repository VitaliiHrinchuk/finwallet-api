import { ListAccountDto } from "../dto/list-account.dto";

export class ListAccountsQuery {
  constructor(
    public readonly dto: ListAccountDto
  ) {
  }
}
