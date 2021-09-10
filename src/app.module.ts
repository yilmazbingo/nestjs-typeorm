//testing
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
// configModule chooses the .env file, configservice extract the settings
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/repot.entity';
const cookieSession = require('cookie-session');

// forRooot means, this module will be sharedown all other modules.
// sqlite is file based database
@Module({
  imports: [
    UsersModule,
    ReportsModule,
    ConfigModule.forRoot({
      // this is set so we do not have to reimport the ConfigModule all over the place into other modules
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // Notice we are not using TypeOrmModule.forRoot({})
    // we set this to get access to ConfigService through dependency injection system
    TypeOrmModule.forRootAsync({
      // this tell DI system, find the configService which has all of the config info
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          // whenever our app starts up, typeorm is going to look at User Entity properties and types and compare it with the User table in database.
          // if u go to UserEntity and delete a property, and restart the app, when typeorm reads the UserEntity next time, it sees that that property no longer exists. it willl go to db, find the Users table and automatically remove that column from the table. if we add a property to UserEntity, this time it will add a new column to the table
          //this is extremely uncommon behavior. in prod we use migrations
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),

    //-- we need to change the setting for environment configuration
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db-sqlite',
    //   entities: [User, Report],
    //   // this is used onlu in dev environment. it automatically updates the structure of your db. in prod, we write migrations
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        // any properties except what is set in dtos, will be stripped off automatically
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  // this will be called automatically when your app start
  configure(consumer: MiddlewareConsumer) {
    // set up middleware that will run on every incoming request
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
        // this means we want to use this middleware for every incoming request
      )
      .forRoutes('*');
  }
}

// A migration is file that has two functions defined inside of it. up() and down()
// up() will describe some kind of update that we actually want to apply. creating a table, adding a table, renaming a column
// down() we are going to describe how to undo the steps that we committed during up(). down() undo the process
// typeoprm cli will run code only inside entity files and migration files. it has no idea is what nest is.
