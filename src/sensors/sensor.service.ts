import { Injectable } from '@nestjs/common';
import { SensorDal } from './sensor.dal';

import { Sensor } from 'src/entities/sensor.entity';
import { CachingService } from 'src/redis/caching.service';
import { SensorReadingService } from 'src/sensor-reading/sensor-reading.service';

@Injectable()
export class SensorService {
  constructor(
    private readonly sensorDal: SensorDal,
    // private readonly sensorReadingService: SensorReadingService,
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

  // todo delete this abomination
  async getSensors(): Promise<any[]> {
    const cacheKey = `sensors`;
    let sensors = await this.cachingService.get<Sensor[]>(cacheKey);
    if (!sensors) {
      sensors = await this.sensorDal.findAll();
      await this.cachingService.set(cacheKey, sensors);
    }
    sensors[0].color = 'green';
    sensors[1].color = 'yellow';
    sensors[2].color = 'orange';
    sensors[3].color = 'red';

    return sensors.map((sensor) => ({ ...sensor, color: 'green' }));
  }
}
