import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateSensorDto {
  //   @ApiProperty()
  //   @IsString()
  //   @IsNotEmpty()
  //   id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originalId: string;
}
