import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { SummaryModule } from './modules/summary/summary.module';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
@Module({
  imports: [
    DatabaseModule,
    SummaryModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    SummaryModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
      sortSchema: true,
      playground: configService.getOrThrow('NODE_ENV') === 'development',
    }),
  ],
  controllers: [AppController],
  providers: [AppService ],
})
export class AppModule { }
