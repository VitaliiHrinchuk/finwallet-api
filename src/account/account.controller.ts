import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateAccountDto } from "./dto/create-account.dto";
import { CreateAccountCommand } from "./commands/create-account.command";
import { SetUserIdInterceptor } from "../common/interceptors/set-user-id-interceptor";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller('accounts')
export class AccountController {

  constructor(private commandBus: CommandBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.commandBus.execute(new CreateAccountCommand(createAccountDto));
  }
}
