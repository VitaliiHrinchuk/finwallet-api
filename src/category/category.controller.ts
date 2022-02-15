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
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateCategoryCommand } from "./commands/create-category.command";
import { ListCategoryQuery } from "./commands/list-category.query";
import { ShowCategoryQuery } from "./commands/show-category.query";
import { SetEntityIdInterceptor } from "../common/interceptors/set-entity-id-interceptor";
import { DeleteCategoryDto } from "./dto/delete-category.dto";
import { DeleteCategoryCommand } from "./commands/delete-category.command";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { UpdateCategoryCommand } from "./commands/update-category.command";
import { ListCategoryDto } from "./dto/list-category.dto";


@Controller('category')
export class CategoryController {

  constructor(private commandBus: CommandBus) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.commandBus.execute(new CreateCategoryCommand(createCategoryDto));
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async browse(@Query() listCategoryDto: ListCategoryDto) {
    return this.commandBus.execute(new ListCategoryQuery(listCategoryDto));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async read(@Param('id') id, @Request() req) {
    return this.commandBus.execute(new ShowCategoryQuery(id,req.user.userId));
  }


  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async delete(@Body() deleteCategoryDto: DeleteCategoryDto) {
    return this.commandBus.execute(new DeleteCategoryCommand(deleteCategoryDto));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  @UseInterceptors(SetEntityIdInterceptor)
  async update(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.commandBus.execute(new UpdateCategoryCommand(updateCategoryDto));
  }
}
