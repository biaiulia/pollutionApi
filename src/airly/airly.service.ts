import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';

@Injectable()
export class AirlyService {
  private apiKey: string;
  private airlyApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {
    this.apiKey = this.configService.get<string>('AIRLY_API_KEY');
    this.airlyApiUrl = this.configService.get<string>('AIRLY_API_URL');
  }

  async getDataFromAirly(sensorId: string): Promise<any> {
    const url = `${this.airlyApiUrl}/v2/measurements/installation?installationId=${sensorId}`;
    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: this.apiKey,
      },
    };

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, axiosConfig).pipe(
          map((response) => response.data),
          catchError((error) => {
            this.logger.error('HTTP request failed:', error);
            return of(null);
          }),
        ),
      );

      return response;
    } catch (error) {
      this.logger.error('Error fetching data from Airly API:', error.message);
      throw new Error(error.message);
    }
  }
}
