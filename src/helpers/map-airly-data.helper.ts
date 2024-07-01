import { SensorReadingCreateDto } from 'src/dtos/sensor-reading-create.dto';
import { calculateAqiLevel } from './calculate-aqi.helper';

const valueMapping = {
  PM1: 'PM1',
  PM25: 'PM25',
  PM10: 'PM10',
  TEMPERATURE: 'temperature',
  HUMIDITY: 'humidity',
  PRESSURE: 'pressure',
};

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export function mapRawDataToSensorReading(
  sensorId: string,
  rawData: any[],
  date: Date,
): SensorReadingCreateDto {
  const mappedData: Partial<SensorReadingCreateDto> = {
    sensorId,
    dateTime: date,
    //TODO: add day of week
    dayOfWeek: dayNames[1],
  };

  rawData.forEach((dataItem) => {
    const mappedKey = valueMapping[dataItem.name];
    if (mappedKey) {
      mappedData[mappedKey] = dataItem.value;
    }
  });

  mappedData.aqiLevel = calculateAqiLevel(mappedData.PM25, mappedData.PM10);
  return mappedData as SensorReadingCreateDto;
}
