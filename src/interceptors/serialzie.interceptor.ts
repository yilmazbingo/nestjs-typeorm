import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

// Normally user entity goes into the interceptor and nestjs turns it into the JSON. But we we ill turn it to User DTO which will have all the serialization rules.
// then nest will take dto and turn it to the json and send it back as response

// this means any class
interface ClassConstructor {
  new (...args: any[]): {};
}
// this is a custom decorator
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializerInterceptor(dto));
}
// with implement, our class will satisfy either an abstract class or an interface
export class SerializerInterceptor implements NestInterceptor {
  // passing dto will make this class reusable
  constructor(private dto: any) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    return handler.handle().pipe(
      // data is the incoming user entity
      map((data: any) => {
        return plainToClass(this.dto, data, {
          //   this takes care of everything. this will expose things that are set
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
