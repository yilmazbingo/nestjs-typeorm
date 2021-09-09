/*
Guards are classes that are decorated with the @Injectable() decorator and implement the CanActivate interface. A guard is responsible for determining if a request should be
 handled by a route handler or route. Guards are executed after every middleware, but before pipes. Unlike middleware, guardshave access to the ExecutionContext object, 
 so they know exactly what is going to evaluated.
*/
import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
