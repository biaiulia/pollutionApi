import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, MinLength } from 'class-validator';
import { UserRoleEnum } from 'src/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @MinLength(8)
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}
