import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';
import { SensorReadingCreateDto } from '../dtos/sensor-reading-create.dto';

@Injectable()
export class AirlyService {
  private sensorIds: string[];
  private apiKey: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.sensorIds = [
      this.configService.get<string>('SENSOR_ID_1'),
      this.configService.get<string>('SENSOR_ID_2'),
      this.configService.get<string>('SENSOR_ID_3'),
      this.configService.get<string>('SENSOR_ID_4'),
    ];
    this.apiKey = this.configService.get<string>('AIRLY_API_KEY');
  }

  async getDataFromAirly(sensorId: string): Promise<any> {
    const options = {
      hostname: 'airapi.airly.eu',
      path: `/v2/measurements/installation?installationId=${sensorId}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: this.apiKey,
      },
    };

    return this.httpService.get(options.path, options).pipe(
      map((response) => response.data),
      catchError((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(
            `API call failed with status code: ${error.response.status}`,
          );
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          throw new Error('No response received from API');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error('Error setting up API request');
        }
      }),
    );
  }

  private calculateAqiLevel(pm25: number, pm10: number): string {
    const pm25Levels = {
      Good: 25,
      Fair: 50,
      Moderate: 90,
      Poor: 180,
      'Very Poor': Infinity,
    };

    const pm10Levels = {
      Good: 50,
      Fair: 100,
      Moderate: 250,
      Poor: 350,
      'Very Poor': Infinity,
    };

    const pm25Level = Object.keys(pm25Levels).find(
      (key) => pm25 <= pm25Levels[key],
    );

    const pm10Level = Object.keys(pm10Levels).find(
      (key) => pm10 <= pm10Levels[key],
    );

    return pm25Level && pm10Level
      ? [pm25Level, pm10Level].sort(
          (a, b) =>
            ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'].indexOf(a) -
            ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'].indexOf(b),
        )[1]
      : 'Unknown';
  }

  async insertSensorData(sensorData: any, sensorId: string): Promise<void> {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    for (const reading of sensorData.history) {
      let PM1, PM25, PM10, TEMPERATURE, HUMIDITY, PRESSURE;

      // Extracting the values for each parameter
      reading.values.forEach((val) => {
        switch (val.name) {
          case 'PM1':
            PM1 = val.value;
            break;
          case 'PM25':
            PM25 = val.value;
            break;
          case 'PM10':
            PM10 = val.value;
            break;
          case 'TEMPERATURE':
            TEMPERATURE = val.value;
            break;
          case 'HUMIDITY':
            HUMIDITY = val.value;
            break;
          case 'PRESSURE':
            PRESSURE = val.value;
            break;
        }
      });

      const dateTime = reading.fromDateTime;
      const readingDate = new Date(dateTime);
      const dayOfWeek = dayNames[readingDate.getDay()];

      // Check if this datetime and sensor_id combination already exists
      const exists = await this.prisma.sensorReading.findFirst({
        where: { sensorId, dateTime },
      });

      if (!exists) {
        const sensorReading: SensorReadingCreateDto = {
          sensorId,
          dateTime,
          PM25,
          PM10,
          PM1,
          temperature: TEMPERATURE,
          humidity: HUMIDITY,
          pressure: PRESSURE,
          dayOfWeek,
          aqiLevel: this.calculateAqiLevel(PM25, PM10),
        };

        await this.prisma.sensorReading.create({
          data: sensorReading,
        });
        console.log('Insert result:', { sensorId, dateTime });
      } else {
        console.log(
          `Data for sensor_id ${sensorId} and datetime ${dateTime} already exists. Skipping insertion.`,
        );
      }
    }
  }

  async fetchDataForAllSensors() {
    for (const sensorId of this.sensorIds) {
      const airlyData = await this.getDataFromAirly(sensorId);
      await this.insertSensorData(airlyData, sensorId);
    }

    console.log('Successfully inserted historical data for all sensors.');
  }
}
