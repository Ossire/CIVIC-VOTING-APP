import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express'; // <--- Import these!

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>(); // Generic tells TS what this is
    const request = ctx.getRequest<Request>(); // Generic tells TS what this is

    console.error('--- LOGGING ERROR ---', exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const res =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';

    const message =
      typeof res === 'object' && res !== null && 'message' in res
        ? res['message']
        : res;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message || 'Error',
    });
  }
}
