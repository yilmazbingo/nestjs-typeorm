import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  // executiion context is a wrapper around incoming request
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;
  }
}
// in this project, req goes through cookie-session middleware and then it goes off to the admin guard. req is processed by the admin guard before interceptor runs. so currentUser will be undefined
// we need to take aour currentUser interceptor and we need to turn it into a middleware. it will guarantee that middleware will run before adminGuard
// Interceptors will run after every middleware and after any guards.
