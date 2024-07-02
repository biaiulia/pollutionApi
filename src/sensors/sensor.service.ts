import { Injectable } from '@nestjs/common';
import { SensorDal } from './sensor.dal';

import { Sensor } from 'src/entities/sensor.entity';
import { CachingService } from 'src/redis/caching.service';
import { SensorReadingService } from 'src/sensor-reading/sensor-reading.service';
// import { SensorReadingService } from 'src/sensor-reading/sensor-reading.service';

@Injectable()
export class SensorService {
  constructor(
    private readonly sensorDal: SensorDal,
    // private readonly sensorReadingService: SensorReadingService,
    private readonly cachingService: CachingService,
    private readonly sensorReadingService: SensorReadingService,
  ) {}

  async getSensor(sensorId: string): Promise<Sensor> {
    const cacheKey = `sensor:${sensorId}`;
    const cachedSensor = await this.cachingService.get<Sensor>(cacheKey);

    if (cachedSensor) {
      return cachedSensor;
    }
    const sensor = await this.sensorDal.findById(sensorId);
    if (!sensor) {
      return null;
    }
    await this.cachingService.set(cacheKey, sensor);
    return sensor;
  }

  async getSensors(): Promise<any[]> {
    const cacheKey = `sensors`;
    let sensors = await this.cachingService.get<Sensor[]>(cacheKey);
    if (!sensors) {
      sensors = await this.sensorDal.findAll();
      if (sensors) {
        await this.cachingService.set(cacheKey, sensors);
      }
    }

    const mappedSensors = await Promise.all(
      sensors.map(async (sensor) => {
        const { aqiLevel, aqiColor } =
          await this.sensorReadingService.getLatestAqiLevel(sensor.id);
        return {
          ...sensor,
          aqiLevel,
          aqiColor,
        };
      }),
    );

    return mappedSensors;
  }
}
