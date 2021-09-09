import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // execution context can be websocket incoming message, grpc request, http req, alotof different kinds of req
  // it is just the incoming ereq
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log(request.session.userId);
    //   what ever we provide arg to the CurrentUser('arg') will be shown as data. this decorator does not need any arg
    // never meaans this argument will never be used
    return request.currentUser;
  },
);
