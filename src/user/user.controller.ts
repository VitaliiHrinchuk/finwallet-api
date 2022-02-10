import { Body, Controller, Get, UseGuards, Request, ClassSerializerInterceptor, UseInterceptors } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand, ShowUserQuery } from "./commands";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserEntity } from "./domain/user.entity";

@Controller('user')
export class UserController {

  constructor(private commandBus: CommandBus) {}

  @Get('/iam')
  @UseGuards(JwtAuthGuard)
  async iam(@Request() req): Promise<UserEntity> {
    return this.commandBus.execute(new ShowUserQuery(req.user.userId))
  }

}
