import { Injectable } from '@nestjs/common';
import { SensorDal } from './sensor.dal';

import { Sensor } from 'src/entities/sensor.entity';
import { CachingService } from 'src/redis/caching.service';

@Injectable()
export class SensorService {
  constructor(
    private readonly sensorDal: SensorDal,
    private readonly cachingService: CachingService,
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

  async getSensors(): Promise<Sensor[]> {
    const cacheKey = `sensors`;
    let sensors = await this.cachingService.get<Sensor[]>(cacheKey);
    if (!sensors) {
      sensors = await this.sensorDal.findAll();
      await this.cachingService.set(cacheKey, sensors);
    }
    return sensors;
  }
}
