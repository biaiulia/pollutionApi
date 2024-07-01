import { Controller, Get } from '@nestjs/common';
import { SensorService } from './sensor.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/* get sensors with locations and last reading, if the type is airly:
  1. check redis
  2. check db
  3. if not get from airly
  4. add to db add to redis
  5. return to FE: sensor {readings}
  */
@ApiBearerAuth('token')
@ApiTags('sensors')
@Controller('sensors')
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async getSensors() {
    return this.sensorService.getSensors();
  }

  //   @UseGuards(AuthGuard())
  //   @Post('create')
  //   async createSensor(@Body() createSensorDto: CreateSensorDto) {
  //     return this.sensorService.createSensor(createSensorDto);
  //   }

  // @Get('readings')
  // async getSensorReadings() {
  //   return this.sensorService.getSensorReadings();
  // }

  // @Get('readings/:sensorId')
  // async getSensorReadingsBySensorId(@Param('sensorId') sensorId: string) {
  //   return this.sensorService.getSensorReadingsBySensorId(sensorId);
  // }
}
