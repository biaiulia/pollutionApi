import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SensorService } from './sensor.service';
import { CreateSensorDto } from '../dtos/create-sensor.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sensor')
@Controller('sensor')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  //   @UseGuards(AuthGuard())
  //   @Post('create')
  //   async createSensor(@Body() createSensorDto: CreateSensorDto) {
  //     return this.sensorService.createSensor(createSensorDto);
  //   }

  @Get('readings')
  async getSensorReadings() {
    return this.sensorService.getSensorReadings();
  }

  @Get('readings/:sensorId')
  async getSensorReadingsBySensorId(@Param('sensorId') sensorId: string) {
    return this.sensorService.getSensorReadingsBySensorId(sensorId);
  }
}
