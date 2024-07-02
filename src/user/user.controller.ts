import { Controller, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Public } from 'src/auth/public.decorator';
import { LoginUserDto } from 'src/dtos/login-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('login')
  async login(@Body() user: LoginUserDto) {
    return this.userService.login(user.email, user.password);
  }

  @Public()
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    return this.userService.register(createUser);
  }

  @Public()
  @Post('verify-user')
  async validateUser(@Query('token') token: string) {
    return this.userService.verifyUser(token);
  }

  @Post('expo-token')
  async saveExpoToken(@Body('token') token: string) {
    return this.userService.saveExpoToken(token);
  }
}
