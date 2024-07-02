import { Controller, Post, Body, Query, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { Public } from 'src/auth/public.decorator';
import { LoginUserDto } from 'src/dtos/login-user.dto';

@ApiBasicAuth('token')
@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Throttle(15, 900) // 15 requests per 15 minutes
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

  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string): Promise<void> {
    return this.userService.delete(userId);
  }
}
