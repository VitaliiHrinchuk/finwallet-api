import { Body, Controller, Get, Post, UseGuards, UseInterceptors, Request, Param, Delete, Put } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateAccountDto } from "./dto/create-account.dto";
import { CreateAccountCommand } from "./commands/create-account.command";
import { SetUserIdInterceptor } from "../common/interceptors/set-user-id-interceptor";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ListAccountsQuery } from "./commands/list-accounts.query";
import { ShowAccountQuery } from "./commands/show-account.query";
import { DeleteAccountDto } from "./dto/delete-account.dto";
import { DeleteAccountCommand } from "./commands/delete-account.command";
import { SetEntityIdInterceptor } from "../common/interceptors/set-entity-id-interceptor";
import { UpdateAccountCommand } from "./commands/update-account.command";
import { UpdateAccountDto } from "./dto/update-account.dto";

@Controller('accounts')
export class AccountController {

  constructor(private commandBus: CommandBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.commandBus.execute(new CreateAccountCommand(createAccountDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async browse(@Request() req) {
    return this.commandBus.execute(new ListAccountsQuery(req.user.userId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async read(@Param('id') id, @Request() req) {
    return this.commandBus.execute(new ShowAccountQuery(id,req.user.userId));
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async delete(@Body() deleteAccountDto: DeleteAccountDto) {
    return this.commandBus.execute(new DeleteAccountCommand(deleteAccountDto));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async update(@Body() updateAccountDto: UpdateAccountDto) {
    return this.commandBus.execute(new UpdateAccountCommand(updateAccountDto));
  }
}