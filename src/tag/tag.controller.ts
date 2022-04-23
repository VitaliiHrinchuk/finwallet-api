import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SetUserIdInterceptor } from "../common/interceptors/set-user-id-interceptor";
import { SetEntityIdInterceptor } from "../common/interceptors/set-entity-id-interceptor";
import { CreateTagDto } from "./dto/create-tag.dto";
import { CreateTagCommand } from "./commands/create-tag.command";
import { ListTagQuery } from "./commands/list-tag.query";
import { ShowTagQuery } from "./commands/show-tag.query";
import { DeleteTagDto } from "./dto/delete-tag.dto";
import { DeleteTagCommand } from "./commands/delete-tag.command";
import { UpdateTagDto } from "./dto/update-tag.dto";
import { UpdateTagCommand } from "./commands/update-tag.command";

@Controller('tag')
export class TagController {

  constructor(private commandBus: CommandBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async create(@Body() createTagDto: CreateTagDto) {
    return this.commandBus.execute(new CreateTagCommand(createTagDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async browse(@Request() req) {
    return this.commandBus.execute(new ListTagQuery(req.user.userId));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async read(@Param('id') id, @Request() req) {
    return this.commandBus.execute(new ShowTagQuery(id,req.user.userId));
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async delete(@Body() deleteTagDto: DeleteTagDto) {
    return this.commandBus.execute(new DeleteTagCommand(deleteTagDto));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async update(@Body() updateTagDto: UpdateTagDto) {
    return this.commandBus.execute(new UpdateTagCommand(updateTagDto));
  }
}
