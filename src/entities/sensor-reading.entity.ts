export interface SensorReading {
  id?: string;
  dateTime: Date;
  PM25?: number;
  PM10?: number;
  PM1?: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  sensorId: string;
  dayOfWeek?: string;
  aqiLevel?: string;
}
