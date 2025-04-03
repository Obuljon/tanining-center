import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { subscribe } from 'diagnostics_channel';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class NatsService {
  constructor(
    @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
  ) {}

  handleNatsRequesttoPromis<T>(pattern: string, data: any): Observable<T> {
    return this.natsClient
      .send<T>(pattern, data)
      .pipe((value) => value)
      .pipe(
        catchError((err) => {
          const { statusCode, message } = err;
          throw new HttpException(
            message || 'Internal server error',
            statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      );
  }

  handleNatsRequest<T>(pattern: string, data: any): Observable<T> {
    return this.natsClient.send<T>(pattern, data).pipe(
      catchError((err) => {
        const { statusCode, message } = err;
        throw new HttpException(
          message || 'Internal server error',
          statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }),
    );
  }

  handleNatsEvent(pattern: string, data: any): void {
    this.natsClient
      .emit(pattern, data)
      .pipe(
        catchError((err) => {
          const { statusCode, message } = err;
          throw new HttpException(
            message || 'Internal server error',
            statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }),
      )
      .subscribe({
        error: (err) => {
          console.error('Error emitting event:', err);
        },
      });
  }
}
