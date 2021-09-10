- Modules in Nest.js are singletons by default. This means that you can share the same instance of an exported component, such as the EntryService above, between modules without any effort.
- we do not create repos with nest cli
- type orm works with mongo too
- when we work with typeorm, we dont need to create any repository
- Authentication is all about who is the making a request, authoriation if the person making the request is allowed to make it

# repos vs entities

repos have a set of methods attached to them taht we are going to use to work with data inside of our database.

## NotFoundException:

Currently we have user service that is throwing some errors around not found user. We use NotFoundException, nestjs will capture this error and send back a 404 response to whoever made the request. The issue is if we throw error like that, it is going to flow into UsersController, which communicates over http. Nest itself designed assuming that you migh eventually handle communication protocols besides HTTP requests. NotFoundException are not compatibe with any other kind of communication protocol. SO if we throw NotFoundException from the user service and that user service being used by these other kinds of controllers like WebSocket or GRPC, they are not going to properly capture the error , extract information from it and send response back to whoever made the request to us.

A very easy thing to do here would be to implement your own exceptions filter.

- WITH DEPENDENCY INJECTION WE CONNECT DIFFERENT CLASSESS INSIDE A SINGLE MODULE. WE CREATE A CLASS AND MARK IT INJECTABLE

## creating custom CurrentUser param:

I need both decoratro and inceptor. Why do i need inceptor?

With decorator we reach the sesssion, get the userId and now we need to reach db and fetch the db. SO we need to use the service. Unfortunately thats where things are going to start to get challenging. Because, userService is a part of the dependency injection system. We cannot just import the user service and create a new instance of it ourselves. The service makes use of the users repository and that users repository is setup only through dependency injection.

Why does it matter in this case.

Unfortunately we cannot make use of dependency injection with a parameter decorator. This decorator cannot reach into the system in any way and try to get access to some instacnce of anything inside there. Interceptor is going to solve this problem.

this interceptor will read the session object, it is also going to read in through dependecny injection our user service. Then isndie the interceptor, that is where we are going to do our lookup for the current user. Eventually we are going to expose that value that we find through decorator.

We could just use the interceptor itself, instead of param+interceptor

```js
@Get('/whoami')
whoAmI(@Request() request: Request) {

  return  request.currentUser
}

```

Now we have to wire up the inteceptor to our application.

## Connecting an interceptor to dependency injection

Whenever we want to use that decorator, we first have to run the interceptor. Interceptor has to run first to make sure we assign th ecurrent user to the request first. we can use interceptors in two ways. Go to users module

```js
@Module({
// this createes repository
imports: [TypeOrmModule.forFeature([User])],
controllers: [UsersController],
providers: [UsersService, AuthService,CurrentUserInterceptor],
})
```

then go to users controller

```js
import { UseInterceptors } from '@nestjs/common';
```

Downside of this approach, we have to use alot of imports and set up settings. Becasue an interceptor in only being applied to one controller at a time, we refer to as being contoller scoped. Rather than having a controller scoped interceptor, we are going to make our interceptor globally scoped. So one single instance of our interceptor is going to be applied to every request that comes into our application, regardless of what controller that request is going to.

## Env

Whenever we create app module, that creates a DI container, allows us to list out some different classes and what their dependencies are. We are going to use a new service Config Service

npm i @nestjs/config

this package includes dotenv. nest docs says multiple .env files are ok. dotenv docs says "never create more than one .env file'. But we need test.env and dev.env

## Error sqlite3 is locked

jest tries to run all of differents test exact same time. because we have 2 e2e test files are running. Each file has beforeEach() statements that tries to connects to database
aqlite does not like to see multiple different connections to it. ts-jest running parallel tests have worst performance. to change the behaviour go to package.json

```js
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}
```
