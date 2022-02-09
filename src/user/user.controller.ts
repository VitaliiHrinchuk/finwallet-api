import { Body, Controller, Get } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateUserCommand } from "./commands";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('user')
export class UserController {

  constructor(private commandBus: CommandBus) {}

  @Get()
  create(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.commandBus.execute(new CreateUserCommand(createUserDto))
  }
}
