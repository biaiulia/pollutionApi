import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class SensorReadingCreateDto {
  @IsDate()
  @Type(() => Date)
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

  @IsOptional()
  @IsString()
  aqiLevel?: string;

  @IsString()
  sensorId: string;
}
