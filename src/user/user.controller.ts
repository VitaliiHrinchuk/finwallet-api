import {
  Body,
  Controller,
  Get,
  UseGuards,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand, ShowUserQuery } from "./commands";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserEntity } from "./domain/user.entity";
import { SetUserIdInterceptor } from "../common/interceptors/set-user-id-interceptor";
import { SetupUserDto } from "./dto/setup-user.dto";
import { SetupUserCommand } from "./commands/setup-user-command";

@Controller('user')
export class UserController {

  constructor(private commandBus: CommandBus) {}

  @Get('/iam')
  @UseGuards(JwtAuthGuard)
  async iam(@Request() req): Promise<UserEntity> {
    return this.commandBus.execute(new ShowUserQuery(req.user.userId))
  }

  @Post('/setup')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(SetUserIdInterceptor)
  async setup(@Body() dto: SetupUserDto): Promise<UserEntity> {
    return this.commandBus.execute(new SetupUserCommand(dto))
  }

}
