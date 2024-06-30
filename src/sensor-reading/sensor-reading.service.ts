import { Injectable, NotFoundException } from '@nestjs/common';
import { SensorReadingDal } from './sensor-reading.dal';
import { AirlyService } from '../airly/airly.service';
import { SensorTypeEnum } from 'src/enums/sensor-type.enum';

import { SensorService } from 'src/sensors/sensor.service';
import { SensorReading } from 'src/entities/sensor-reading.entity';
import { CachingService } from 'src/redis/caching.service';

@Injectable()
export class SensorReadingService {
  constructor(
    private readonly sensorReadingDal: SensorReadingDal,
    private readonly sensorService: SensorService,
    private readonly airlyService: AirlyService,
    private readonly cachingService: CachingService,
    //  @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getSensorReadings(sensorId: string) {
    const sensor = await this.sensorService.getSensor(sensorId);

    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${sensorId} not found`);
    }

    const cacheKey = `sensor:${sensorId}:readings`;
    let readings = await this.cachingService.get<SensorReading[]>(cacheKey);

    if (!readings) {
      if (sensor.type === SensorTypeEnum.AIRLY) {
        // Check if data exists in the database
        readings = await this.sensorReadingDal.findBySensorId(sensorId);
        if (readings.length === 0) {
          // If data doesn't exist, fetch from Airly and store it
          const airlyData = await this.airlyService.getDataFromAirly(sensorId);
          await this.airlyService.insertSensorData(airlyData, sensorId);
          readings = await this.sensorReadingDal.findBySensorId(sensorId);
        }
      } else {
        // Return local sensor data
        readings = await this.sensorReadingDal.findBySensorId(sensorId);
      }
      await this.cachingService.set(cacheKey, readings, 3600);
    }

    return readings;
  }
}
