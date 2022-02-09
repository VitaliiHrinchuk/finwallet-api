import { Body, Controller, Post, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInUserDto } from "./dto/SingInUserDto";
import { SignUpUserDto } from "./dto/SignUpUserDto";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() signInUserDto: SignInUserDto) {
    return this.authService.login(signInUserDto);
  }

  @Post('register')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }
}
