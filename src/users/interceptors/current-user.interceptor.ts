//  this interceptor will be used by the custom param decoratro to fetch the currnet User
// interceptor can modify the response too. 
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users.service';

@Injectable()
// "implements" guide us how to put together an interceptor
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UsersService) {}
  // handler refers to the route handler
  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};
    if (userId) {
      const user = await this.userService.findOne(userId);
      // we need to pass this down to the decorator. SO we assign the user to request because req can be retrieved inside the decorator
      request.currentUser = user;
    }
    // run the actual route handler
    return handler.handle();
  }
}
