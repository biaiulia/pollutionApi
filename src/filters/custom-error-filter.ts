import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();

    let { message } = exception;

    if (
      exception instanceof BadRequestException &&
      typeof exception.getResponse() === 'object'
    ) {
      const validationErrors = exception.getResponse() as { message?: string };
      if (
        validationErrors &&
        validationErrors.message &&
        Array.isArray(validationErrors.message)
      ) {
        message = validationErrors.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}