import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

const PG_UNIQUE_VIOLATION = '23505';

interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: string[];
}

@Catch()
export class ProblemDetailsFilter implements ExceptionFilter {
  private readonly logger = new Logger(ProblemDetailsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const problem = this.toProblem(exception, req.path);

    if (problem.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `${req.method} ${req.path}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    res.status(problem.status).type('application/problem+json').json(problem);
  }

  private toProblem(exception: unknown, instant: string): ProblemDetails {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      let detail = exception.message;
      let errors: string[] | undefined;

      if (typeof body === 'object' && body !== null && 'message' in body) {
        const { message } = body as { message: unknown };

        if (Array.isArray(message)) {
          detail = 'Request validation failed';
          errors = message.map(String);
        } else if (typeof message === 'string') {
          detail = message;
        }
      }
      return this.build(status, detail, instant, errors);
    }

    if (exception instanceof EntityNotFoundError) {
      return this.build(HttpStatus.NOT_FOUND, 'Resource not found', instant);
    }

    if (exception instanceof QueryFailedError) {
      const { code } = exception.driverError as Error & { code?: string };
      if (code === PG_UNIQUE_VIOLATION) {
        return this.build(
          HttpStatus.CONFLICT,
          'Resource already exists',
          instant,
        );
      }
    }

    return this.build(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'Internal server error',
      instant,
    );
  }

  private build(
    status: number,
    detail: string,
    instance: string,
    errors?: string[],
  ): ProblemDetails {
    return {
      type: 'about:blank',
      title: STATUS_CODES[status] ?? 'Error',
      status,
      detail,
      instance,
      ...(errors && { errors }),
    };
  }
}
