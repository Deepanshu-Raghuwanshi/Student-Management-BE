import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let data: any[] = [];
    let errors: any[] = [];
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      message = exceptionResponse['message'] || 'Internal server error';
      data = exceptionResponse['response']?.data || [];
      errors = exceptionResponse['errors'] || [];
    } else {
      message = 'Internal server error';
    }

    if (exception instanceof BadRequestException) {
      const validationErrors =
        exceptionResponse['message'] || exceptionResponse;

      const formattedErrors = Array.isArray(validationErrors)
        ? validationErrors.map((error) =>
            typeof error === 'object' && error.property
              ? `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`
              : error,
          )
        : validationErrors;

      return response.status(status).json({
        statusCode: status,
        message: 'Validation failed',
        error: true,
        success: false,
        data,
        errors: formattedErrors,
      });
    }

    response.status(status).json({
      statusCode: status,
      error: true,
      success: false,
      data,
      message,
      errors,
    });
  }
}
