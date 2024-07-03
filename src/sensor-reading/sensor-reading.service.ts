import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { SensorReadingDal } from './sensor-reading.dal';
import { AirlyService } from '../airly/airly.service';
import { SensorTypeEnum } from 'src/enums/sensor-type.enum';
import { SensorReadingQueryParams } from 'src/dtos/sensor-reading-query-params.dto';
import { isLatestAirlyReading } from 'src/helpers/is-latest-airly-reading.helper';
import { mapRawDataToSensorReading } from 'src/helpers/map-airly-data.helper';
import { CachingService } from 'src/redis/caching.service';
import { SensorReading } from 'src/entities/sensor-reading.entity';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { AqiColorsEnum } from 'src/enums/aqi-colors.enum';
import {
  calculateAqiLevel,
  mapAqiLevelsToColors,
} from 'src/helpers/calculate-aqi.helper';
import { AqiLevelEnum } from 'src/enums/aqi-level.enum';
import { NotificationService } from 'src/notifications/notification.service';

@Injectable()
export class SensorReadingService {
  constructor(
    private readonly sensorReadingDal: SensorReadingDal,
    private readonly airlyService: AirlyService,
    private readonly cachingService: CachingService,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationsService: NotificationService,
  ) {}

  async getLatestSensorReading(
    sensorId: string,
  ): Promise<SensorReading | null> {
    const sensor = await this.sensorReadingDal.getSensor(sensorId);
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${sensorId} not found`);
    }
    const cachingKey = `sensor-reading:${sensorId}:latest`;
    const latestCachedReading =
      await this.cachingService.get<SensorReading>(cachingKey);

    if (
      sensor.type === SensorTypeEnum.AIRLY ||
      sensor.type === SensorTypeEnum.NATIONAL
    ) {
      const newData = await this.handleAirlySensor(
        sensorId,
        latestCachedReading,
        cachingKey,
      );
      if (!newData) {
        return null;
      }
      if (
        latestCachedReading &&
        newData.aqiLevel &&
        newData.aqiLevel !== latestCachedReading.aqiLevel
      ) {
        await this.notificationsService.sendNotification(
          `AQI Level Changed for sensor ${newData.sensorId}: ${newData.aqiLevel}`,
          newData,
        );
      }
      return newData;
    }

    if (!latestCachedReading) {
      const latestReading =
        await this.sensorReadingDal.getLatestReading(sensorId);
      if (latestReading) {
        await this.cachingService.set<SensorReading>(
          cachingKey,
          latestReading,
          3600,
        );
      }
      return latestReading;
    }
    return latestCachedReading;
  }

  private async handleAirlySensor(
    sensorId: string,
    latestCachedReading: SensorReading | null,
    cachingKey: string,
  ): Promise<SensorReading | null> {
    if (
      !latestCachedReading ||
      !isLatestAirlyReading(latestCachedReading.dateTime.toString())
    ) {
      const airlyData = await this.airlyService.getDataFromAirly(sensorId);

      if (!airlyData?.current || !airlyData?.current?.values?.length) {
        return null;
      }

      const mappedData = mapRawDataToSensorReading(
        sensorId,
        airlyData.current.values,
        airlyData.current.tillDateTime ?? airlyData.current.fromDateTime,
      );
      const createdSensorReading =
        await this.sensorReadingDal.create(mappedData);
      await this.cachingService.set<SensorReading>(
        cachingKey,
        createdSensorReading,
        5400,
      );

      return createdSensorReading;
    }
    return latestCachedReading;
  }

  async getSensorReadings(
    sensorId: string,
    queryParams: SensorReadingQueryParams,
  ): Promise<SensorReading[]> {
    const sensor = await this.sensorReadingDal.getSensor(sensorId);
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${sensorId} not found`);
    }
    return this.sensorReadingDal.getReadingsBySensorId(sensorId, queryParams);
  }

  async createSensorReading(
    sensorReading: SensorReadingCreateDto,
  ): Promise<SensorReading> {
    const createdSensorReading =
      await this.sensorReadingDal.create(sensorReading);
    if (!createdSensorReading) {
      throw new BadRequestException(
        `Could not add reading for sensor with id ${sensorReading.sensorId} for date ${sensorReading.dateTime}`,
      );
    }
    await this.invalidateCache(sensorReading.sensorId);
    return createdSensorReading;
  }

  private async invalidateCache(sensorId: string): Promise<void> {
    const cacheKey = `sensor-reading:${sensorId}:latest`;
    await this.cachingService.del(cacheKey);
  }

  async getLatestAqiLevel(
    sensorId: string,
  ): Promise<{ aqiLevel: AqiLevelEnum; aqiColor: AqiColorsEnum }> {
    const latestReading = await this.getLatestSensorReading(sensorId);
    if (!latestReading) {
      return { aqiLevel: null, aqiColor: AqiColorsEnum.GREY };
    }
    const aqiLevel = calculateAqiLevel(
      latestReading.PM25,
      latestReading.PM10,
    ) as AqiLevelEnum;
    return { aqiLevel, aqiColor: mapAqiLevelsToColors(aqiLevel) };
  }
}
