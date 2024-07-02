import {
  BadRequestException,
  Injectable,
  NotFoundException,
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

@Injectable()
export class SensorReadingService {
  constructor(
    private readonly sensorReadingDal: SensorReadingDal,
    private readonly airlyService: AirlyService,
    private readonly cachingService: CachingService,
  ) {}

  /* flow for this service:

  1. get sensor
  2. if type = airly check reading for this hour from redis or from db - 
  if it doesn't exist - get from airly with airlyservice.getDataFromAirly(sensorId) -
   latest reading and insert into db and redis cache
  3. if edge node - get latest from redis cache or db
  */

  /* when mqtt service pushes the mqtt data because data change flow:
  1. add sensor readings in db and invalidate redis cache add the new one
  2. send notification
  */

  /* when mqtt publishes the new historical data invalidate cache and save to db

  

*/
  async getLatestSensorReading(sensorId: string): Promise<SensorReading> {
    const sensor = await this.sensorReadingDal.getSensor(sensorId);
    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${sensorId} not found`);
    }
    const cachingKey = `sensor-reading:${sensorId}:latest`;
    const latestCachedReading =
      await this.cachingService.get<SensorReading>(cachingKey);

    if (sensor.type === SensorTypeEnum.AIRLY) {
      if (
        !latestCachedReading ||
        !isLatestAirlyReading(latestCachedReading.dateTime.toString())
      ) {
        const airlyData = await this.airlyService.getDataFromAirly(sensorId);

        if (!airlyData.current || !airlyData.current.values.length) {
          throw new NotFoundException(
            `Data for sensor with id ${sensorId} not found`,
          );
        }

        const mappedData = mapRawDataToSensorReading(
          sensorId,
          airlyData.current.values,
          airlyData.current.tillDateTime ?? airlyData.current.fromDateTime,
        );
        const createdSensorReading =
          await this.sensorReadingDal.create(mappedData);
        if (!createdSensorReading) {
          console.error('couldn`t create');
        }

        await this.cachingService.set<SensorReading>(
          cachingKey,
          createdSensorReading,
        );

        return createdSensorReading;
      }
    }

    if (!latestCachedReading) {
      const latestReading =
        await this.sensorReadingDal.getLatestReading(sensorId);
      if (latestReading) {
        this.cachingService.set<SensorReading>(cachingKey, latestReading, 3600);
      }
      return latestReading;
    }
    return latestCachedReading;
  }

  async getSensorReadings(
    sensorId: string,
    queryParams: SensorReadingQueryParams,
  ) {
    const sensor = await this.sensorReadingDal.getSensor(sensorId);

    if (!sensor) {
      throw new NotFoundException(`Sensor with ID ${sensorId} not found`);
    }
    return this.sensorReadingDal.getReadingsBySensorId(sensorId, queryParams);
  }

  async createSensorReading(sensorReading: SensorReadingCreateDto) {
    const createdSensorReading =
      await this.sensorReadingDal.create(sensorReading);
    if (!sensorReading) {
      throw new BadRequestException(
        `Could not add reading for sensor with id ${sensorReading.sensorId} for date ${sensorReading.dateTime}`,
      );
    }
    return createdSensorReading;
  }

  async getLatestAqiLevel(
    sensorId: string,
  ): Promise<{ aqiLevel: AqiLevelEnum; aqiColor: AqiColorsEnum }> {
    const latestReading = await this.getLatestSensorReading(sensorId);
    const aqiLevel = calculateAqiLevel(
      latestReading.PM25,
      latestReading.PM10,
    ) as AqiLevelEnum;
    return { aqiLevel, aqiColor: mapAqiLevelsToColors(aqiLevel) };
  }
}
