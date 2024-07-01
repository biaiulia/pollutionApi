import { Controller, Get, Param, Query } from '@nestjs/common';
import { SensorReadingService } from './sensor-reading.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SensorReadingQueryParams } from 'src/dtos/sensor-reading-query-params.dto';
import { SensorReading } from 'src/entities/sensor-reading.entity';

@ApiBearerAuth('token')
@ApiTags('sensor-readings')
@Controller('sensor-readings')
export class SensorReadingController {
  constructor(private readonly sensorReadingService: SensorReadingService) {}

  @Get(':sensorId')
  async getSensorReadings(
    @Query() sensorReadingsQueryParams: SensorReadingQueryParams,
    @Param('sensorId') sensorId: string,
  ): Promise<SensorReading[]> {
    return this.sensorReadingService.getSensorReadings(
      sensorId,
      sensorReadingsQueryParams,
    );
  }

  @Get(':sensorId/latest-reading')
  async getLatestSensorReading(
    @Param('sensorId') sensorId: string,
  ): Promise<SensorReading> {
    return this.sensorReadingService.getLatestSensorReading(sensorId);
  }
}
