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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AzureADStrategy } from './auth/azure-ad.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'azure-ad' }),
    SummaryModule,
    BullModule.forRoot({
      redis: {
        host: new ConfigService().getOrThrow<string>('REDIS_HOST'),
        port: +new ConfigService().getOrThrow<number>('REDIS_PORT'),
      },
    }),
    ScheduleModule.forRoot(),
    SummaryModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gpl'),
      sortSchema: true,
      playground: new ConfigService().getOrThrow('NODE_ENV') === 'development',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AzureADStrategy],
})
export class AppModule {}
