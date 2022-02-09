import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SignInUserDto } from "./dto/SingInUserDto";
import * as bcrypt from 'bcrypt';
import { InjectModel } from "@nestjs/sequelize";
import { SignUpUserDto } from "./dto/SignUpUserDto";
import { CommandBus } from "@nestjs/cqrs";
import { User } from "../user/models/user.model";
import { CheckUserQuery, CreateUserCommand } from "../user/commands";
import { CreateUserDto } from "../user/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private bus: CommandBus,
    private jwtService: JwtService
  ) {}

  async login(signInUserDto: SignInUserDto): Promise<any> {
    const user = await this.validateUser(signInUserDto);
    if (user !== null) {
      const payload = { sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } else {
      throw new BadRequestException('Wrong email and password combination');
    }
  }

  async validateUser(signInUserDto: SignInUserDto): Promise<User> {
    const user = await this.bus.execute(new CheckUserQuery(signInUserDto.email));
    if (user) {
      const passwordMatched = await bcrypt.compare(signInUserDto.password, user.passHash);

      return passwordMatched ? user : null;
    }
    return null;
  }

  async signUp(createUserDto: CreateUserDto): Promise<boolean> {
    return this.bus.execute(new CreateUserCommand(createUserDto));
  }
}
