import { IsOptional, IsDateString } from 'class-validator';

export class SensorReadingQueryParams {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
