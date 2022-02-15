import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from "@nestjs/config";
import { EventSourcingModule, PgAdapter } from "nest-event-sourcing";
import { UserModule } from './user/user.module';
import { AuthModule } from "./auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./user/models/user.model";
import { AccountModule } from './account/account.module';
import { Account } from "./account/models/account.model";
import { UserAccount } from "./account/models/user-accounts.model";
import { ConsoleModule } from "nestjs-console";
import { CategoryModule } from './category/category.module';
import { Category } from "./category/models/category.model";
import { TagModule } from './tag/tag.module';
import { Tag } from "./tag/models/tag.model";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          dialect: "postgres",
          host: configService.get<string>("DB_HOST"),
          port: configService.get<number>("DB_PORT"),
          username: configService.get<string>("DB_USERNAME"),
          password: configService.get<string>("DB_PASSWORD"),
          database: configService.get<string>("DB_NAME"),
          models: [User, Account, UserAccount, Category, Tag]
        };
      }
    }),
    EventSourcingModule.forRootAsync({
      useFactory: async (config: ConfigService) => {
        return {
          driver: new PgAdapter({
            port: config.get<number>("ES_PORT"),
            host: config.get<string>("ES_HOST"),
            user: config.get<string>("ES_USERNAME"),
            password: config.get<string>("ES_PASSWORD"),
            database: config.get<string>("ES_NAME")
          })
        }
      },
      inject: [ConfigService]
    }),

    UserModule,
    AuthModule,
    AccountModule,
    ConsoleModule,
    CategoryModule,
    TagModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
