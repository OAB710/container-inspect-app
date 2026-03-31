import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { mapKeysDeep, toCamelCase } from './case-transform.util';

@Injectable()
export class SnakeToCamelPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body' && metadata.type !== 'query') {
      return value;
    }

    return mapKeysDeep(value, toCamelCase);
  }
}
