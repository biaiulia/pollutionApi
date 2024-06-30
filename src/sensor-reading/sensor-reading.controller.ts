import { Controller, Get, Post } from '@nestjs/common';
import { SensorReadingService } from './sensor-reading.service';
import { ApiTags } from '@nestjs/swagger';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';

@ApiTags('sensor-readings')
@Controller('sensor-readings')
export class SensorReadingController {
  constructor(private sensorReadingService: SensorReadingService) {}

  @Get()
  async getSensorReadings() {
    const readings = await this.sensorReadingService.getSensorReadings();
    return readings.map((reading) => ({
      ...reading,
      aqi: this.sensorReadingService.calculateAQI(reading.PM25, reading.PM10),
    }));
  }

  @Post()
  async saveSensorData(data: SensorReadingCreateDto) {
    return this.sensorReadingService.saveSensorData(data);
  }
}
