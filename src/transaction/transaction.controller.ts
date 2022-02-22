import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SetUserIdInterceptor } from "../common/interceptors/set-user-id-interceptor";

import { SetEntityIdInterceptor } from "../common/interceptors/set-entity-id-interceptor";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
import { CreateTransactionCommand } from "./commands/create-transaction.command";
import { ListTransactionQuery } from "./commands/list-transaction.query";
import { ShowTransactionQuery } from "./commands/show-transaction.query";
import { DeleteTransactionDto } from "./dto/delete-transaction.dto";
import { DeleteTransactionCommand } from "./commands/delete-transaction.command";
import { UpdateTransactionDto } from "./dto/update-transaction.dto";
import { UpdateTransactionCommand } from "./commands/update-transaction.command";
import { ListTransactionDto } from "./dto/list-transaction.dto";

@Controller('transaction')
export class TransactionController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.commandBus.execute(new CreateTransactionCommand(createTransactionDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async browse(@Query() listTransactionDto: ListTransactionDto) {
    return this.commandBus.execute(new ListTransactionQuery(listTransactionDto));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async read(@Param('id') id, @Request() req) {
    return this.commandBus.execute(new ShowTransactionQuery(id,req.user.userId));
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async delete(@Body() deleteTransactionDto: DeleteTransactionDto) {
    return this.commandBus.execute(new DeleteTransactionCommand(deleteTransactionDto));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async update(@Body() updateTransactionDto: UpdateTransactionDto) {
    return this.commandBus.execute(new UpdateTransactionCommand(updateTransactionDto));
  }
}
