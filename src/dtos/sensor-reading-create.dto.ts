// sensor-reading-create.dto.ts
import { IsString, IsDate, IsNumber } from 'class-validator';

export class SensorReadingCreateDto {
  @IsDate()
  dateTime: Date;

  @IsNumber()
  PM25: number;

  @IsNumber()
  PM10: number;

  @IsNumber()
  PM1: number;

  @IsNumber()
  temperature: number;

  @IsNumber()
  humidity: number;

  @IsNumber()
  pressure: number;

  @IsString()
  dayOfWeek: string;

  @IsString()
  aqiLevel: string;

  @IsString()
  sensorId: string;
}
