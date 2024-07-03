import { Injectable } from '@nestjs/common';
import { SensorDal } from './sensor.dal';
import { Sensor } from 'src/entities/sensor.entity';
import { CachingService } from 'src/redis/caching.service';
import { SensorReadingService } from 'src/sensor-reading/sensor-reading.service';
import { sensorSeedData } from 'src/prisma/seed';

@Injectable()
export class SensorService {
  constructor(
    private readonly sensorDal: SensorDal,
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
    }
    if (!sensors.length) {
      await this.seedSensors();
      sensors = await this.sensorDal.findAll();
      await this.cachingService.set(cacheKey, sensors);
    }

    return this.mapSensorsWithAqi(sensors);
  }

  private async seedSensors(): Promise<void> {
    await Promise.all(
      sensorSeedData.map((sensor) => {
        this.sensorDal.create(sensor);
      }),
    );
  }

  private async mapSensorsWithAqi(sensors: Sensor[]): Promise<any[]> {
    const sensorReadings = await Promise.all(
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
    return sensorReadings;
  }
}
