import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SensorReadingDal } from './sensor-reading.dal';
import { AirlyService } from '../airly/airly.service';
import { SensorTypeEnum } from 'src/enums/sensor-type.enum';

@Injectable()
export class SensorReadingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sensorReadingDAL: SensorReadingDal,
    private readonly airlyService: AirlyService,
  ) {}

  async getSensorReadings(sensorId: string) {
    const sensor = await this.prisma.sensor.findUnique({
      where: { id: sensorId },
    });

    if (!sensor) {
      throw new Error(`Sensor with ID ${sensorId} not found`);
    }

    if (sensor.type === SensorTypeEnum.AIRLY) {
      // Check if data exists in the database
      const existingData = await this.sensorReadingDAL.findBySensorId(sensorId);
      if (existingData.length > 0) {
        return existingData;
      }

      // If data doesn't exist, fetch from Airly and store it
      const airlyData = await this.airlyService.getDataFromAirly(sensorId);
      await this.airlyService.insertSensorData(airlyData, sensorId);

      // Return the newly inserted data
      return this.sensorReadingDAL.findBySensorId(sensorId);
    } else {
      // Return local sensor data
      return this.sensorReadingDAL.findBySensorId(sensorId);
    }
  }
}
