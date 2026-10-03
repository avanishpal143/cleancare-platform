import {
  ExceptionFilter, Catch, ArgumentsHost,
  HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx  = host.switchToHttp();
    const res  = ctx.getResponse<Response>();
    const req  = ctx.getRequest<Request>();

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: Record<string, string[]> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse() as any;
      message = typeof body === 'string' ? body : body.message ?? message;
      if (Array.isArray(body.message)) {
        // ValidationPipe errors
        errors = {};
        (body.message as string[]).forEach((m) => {
          const field = m.split(' ')[0];
          errors![field] = errors![field] ?? [];
          errors![field].push(m);
        });
        message = 'Validation failed';
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        status  = HttpStatus.CONFLICT;
        message = 'A record with this value already exists';
      } else if (exception.code === 'P2025') {
        status  = HttpStatus.NOT_FOUND;
        message = 'Record not found';
      } else {
        this.logger.error(`Prisma error ${exception.code}:`, exception.message);
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    }

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} → ${status}`,
        exception instanceof Error ? exception.stack : String(exception)
      );
    }

    res.status(status).json({
      success: false,
      error:   message,
      errors,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
