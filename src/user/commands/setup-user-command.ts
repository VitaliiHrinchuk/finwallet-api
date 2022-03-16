import { SetupUserDto } from "../dto/setup-user.dto";

export class SetupUserCommand {
  constructor(
    public readonly dto: SetupUserDto
  ) {
  }
}
