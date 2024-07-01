import { IsString, IsDate, IsNumber, IsOptional } from 'class-validator';

export class SensorReadingCreateDto {
  @IsDate()
  dateTime: Date;

  @IsOptional()
  @IsNumber()
  PM25?: number;

  @IsOptional()
  @IsNumber()
  PM10?: number;

  @IsOptional()
  @IsNumber()
  PM1?: number;

  @IsOptional()
  @IsNumber()
  temperature?: number;

  @IsOptional()
  @IsNumber()
  humidity?: number;

  @IsOptional()
  @IsNumber()
  pressure?: number;

  @IsOptional()
  @IsString()
  dayOfWeek?: string;

  @IsOptional()
  @IsString()
  aqiLevel?: string;

  @IsString()
  sensorId: string;
}
