import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SummaryModule } from './modules/summary/summary.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from './modules/summary/entities/summary.entity';
import { Repository } from 'typeorm';
import { CreateSummaryDTO } from './modules/summary/dto/create-summary.dto';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';
import { JobStatus, Status } from 'src/common/constants/summary';
import { CoreService } from 'src/common/graphql/services/core.service';;

const configService = new ConfigService();
@Module({
  imports: [
    DatabaseModule,
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
