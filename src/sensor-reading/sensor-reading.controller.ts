import { Controller, Get, Param } from '@nestjs/common';
import { SensorReadingService } from './sensor-reading.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('sensor-readings')
@Controller('sensor-readings')
export class SensorReadingController {
  constructor(private readonly sensorReadingService: SensorReadingService) {}

  @Get(':sensorId')
  async getSensorReadings(@Param('sensorId') sensorId: string) {
    return this.sensorReadingService.getSensorReadings(sensorId);
  }
}
