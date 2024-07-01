import { HttpException, Injectable, Logger } from '@nestjs/common';
import { map, catchError } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig, Method } from 'axios';

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

  // async getDataFromAirly(sensorId: string): Promise<any> {
  //   const options = {
  //     hostname: 'airlyApiUrl',
  //     path: `/v2/measurements/installation?installationId=${sensorId}`,
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //       apikey: this.apiKey,
  //     },
  //   };

  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.get(options.path, options).pipe(
  //         map((response) => response.data),
  //         catchError((error) => {
  //           if (error.response) {
  //             throw new Error(
  //               `API call failed with status code: ${error.response.status}`,
  //             );
  //           } else if (error.request) {
  //             throw new Error('No response received from API');
  //           } else {
  //             throw new Error('Error setting up API request');
  //           }
  //         }),
  //       ),
  //     );

  //     return response;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  async getDataFromAirly(sensorId: string): Promise<any> {
    const url = `${this.airlyApiUrl}/v2/measurements/installation?installationId=${sensorId}`;

    const axiosConfig: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: this.apiKey,
      },
    };

    return this.getWithErrorHandling<any>(url, axiosConfig);
  }

  private async makeRequest<T>(
    method: Method,
    url: string,
    body: FormData | Record<string, never> = null,
    axiosConfig: AxiosRequestConfig = {},
  ): Promise<T> {
    const config: AxiosRequestConfig = {
      ...axiosConfig,
      method,
      url,
      data: body,
    };

    return firstValueFrom(
      this.httpService.request<T>(config).pipe(
        map((response) => response?.data),
        catchError((error) => {
          this.logger.error(error);
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'An unknown error occurred';
          const statusCode = error.response?.status || 500;

          this.logger.error(
            `Failed to ${method} due to error: ${errorMessage}`,
          );
          throw new HttpException({ message: errorMessage }, statusCode);
        }),
      ),
    );
  }

  private async getWithErrorHandling<T>(
    url: string,
    axiosConfig: AxiosRequestConfig = {},
  ): Promise<T> {
    return this.makeRequest('GET', url, null, axiosConfig);
  }
}
