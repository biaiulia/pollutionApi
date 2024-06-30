import { Injectable } from '@nestjs/common';
import { SensorDal } from './sensor.dal';
import { MqttService } from '../mqtt/mqtt.service';

import { Sensor } from 'src/entities/sensor.entity';
import { CachingService } from 'src/redis/caching.service';

@Injectable()
export class SensorService {
  constructor(
    private readonly sensorDal: SensorDal,
    private readonly mqttService: MqttService,
    private readonly cachingService: CachingService,
  ) {}

  async getSensor(sensorId: string): Promise<Sensor> {
    const cacheKey = `sensor:${sensorId}`;
    let sensor = await this.cachingService.get<Sensor>(cacheKey);

    if (!sensor) {
      sensor = await this.sensorDal.findById(sensorId);
      await this.cachingService.set(cacheKey, sensor, 3600);
    }

    return sensor;
  }

  async getSensorReadings() {
    return this.sensorDal.findAllReadings();
  }

  async getSensorReadingsBySensorId(sensorId: string) {
    return this.sensorDal.findReadingsBySensorId(sensorId);
  }

  // async publishSensorData(sensorId: string, data: any) {
  //   const topic = `sensors/${sensorId}`;
  //   this.mqttService.publish(topic, JSON.stringify(data));
  // }
}
