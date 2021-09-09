When we first run the e2e test we get "500 Internal Server Error". actual error is "Cannot set property "userId' of undefined".

- In dev environment, we have Users Module and Reports Module. Thet both gets imported to App Module. We then import the App Moule in to main.ts and we have bootstrap function inside there.

```js
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['anything'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // any properties except what is set in dtos, will be stripped off automatically
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

Bootstrap function will create a new nest application out of the app module and then we manually wire up a cookie session and the validation pipe and then we start to listen to traffic on port 3000.

- Durin testing we completely skip the main.ts file. No code inisde the main.ts file gets executed. Instead our E2E test is importing App Module directly and then creating an app out of the app module.

```js
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  // this creates the next application out of the AppModule
  app = moduleFixture.createNestApplication();
  await app.init();
});
```

Since we skip the main.ts, we dont set cooki-session and validation pipe. Durig testing we have no concept of sessions and we have no concept of validating incming requests throught the validation pipe.

- "Cannot set property "userId' of undefined" error throwns because we want to set up "userId" property on the session object. cooki-session is not running that is why we get undefined. there are to possible solutions.

1- easy way is to create a util function that runs cookie-session and validation pipe.

```js
export const setup = (app: any) => {
  app.use(
    cookieSession({
      keys: ['anything'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // any properties except what is set in dtos, will be stripped off automatically
      whitelist: true,
    }),
  );
};
```

now we can use this function in main.ts

```js
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setup(app);
  await app.listen(3000);
}
bootstrap();
```

and in testing file

```js
beforeEach(async () => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  app = moduleFixture.createNestApplication();
  setup(app);
  await app.init();
});
```

2- another solution is we set the cookie-session and validation pipe within the app module itself. So when app module is executed, it will automatically set up the session middleware.

## Define global before each

- in jest-e2e.json add this property

       "setupFilesAfterEnv":["<rootDir>/setup.ts"]

- create setup.ts in root directory.

- if we had multiple test cased in auth.e2e-spec.ts, I would get error because one case will delete but for the second test, type orm actively will try to maintain the database.
