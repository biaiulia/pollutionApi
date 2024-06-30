// sensor-reading.service.ts
import { Injectable } from '@nestjs/common';
import { SensorReadingDal } from './sensor-reading.dal';
import { SensorReading } from '../entities/sensor-reading.entity';
import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';

@Injectable()
export class SensorReadingService {
  constructor(private sensorReadingDAL: SensorReadingDal) {}

  async getSensorReadings(): Promise<SensorReading[]> {
    return this.sensorReadingDAL.getSensorReadings();
  }

  calculateAQI(pm25: number, pm10: number): string {
    // Implement AQI calculation logic based on your criteria
    // Placeholder logic here
    if (pm25 <= 25 && pm10 <= 50) {
      return 'Good';
    } else if (pm25 <= 50 || pm10 <= 100) {
      return 'Fair';
    } else if (pm25 <= 90 || pm10 <= 250) {
      return 'Moderate';
    } else if (pm25 <= 180 || pm10 <= 350) {
      return 'Poor';
    } else {
      return 'Very Poor';
    }
  }

  async saveSensorData(data: SensorReadingCreateDto) {
    return this.sensorReadingDAL.saveSensorReading({
      sensorId: data.sensorId,
      dateTime: new Date(data.dateTime),
      PM25: data.PM25,
      PM10: data.PM10,
      PM1: data.PM1,
      temperature: data.temperature,
      humidity: data.humidity,
      pressure: data.pressure,
      dayOfWeek: new Date(data.dateTime).toLocaleDateString('en-US', {
        weekday: 'long',
      }),
      aqiLevel: this.calculateAQI(data.PM25, data.PM10),
    });
  }
}
