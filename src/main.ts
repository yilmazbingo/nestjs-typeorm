import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // ------ this also set insdie app module for integration testing
  // app.use(
  //   cookieSession({
  //     keys: ['anything'],
  //   }),
  // );
  // this is set inside in main.ts gloablly for integration testing
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     // any properties except what is set in dtos, will be stripped off automatically
  //     whitelist: true,
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
