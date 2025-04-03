import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const error = exception.getError();

    // Log the exception for debugging (uncomment if needed)
    // console.error('Caught exception:', error);

    // Format the response to include statusCode and message
    const formattedError = {
      statusCode: error['statusCode'] || 500,
      message: error['message'] || 'Internal server error',
    };

    return throwError(() => formattedError);
  }
}