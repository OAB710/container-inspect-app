import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { mapKeysDeep, toSnakeCase } from './case-transform.util';

@Injectable()
export class SnakeCaseResponseInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(map((data) => mapKeysDeep(data, toSnakeCase)));
  }
}
