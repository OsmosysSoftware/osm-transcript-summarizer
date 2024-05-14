import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryResolver } from './summary.resolver';
import { Summary } from './entities/summary.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { SummaryQueueProducer } from 'src/jobs/producers/summary/summary.producer';
import { SummaryConsumer } from 'src/jobs/consumers/summary/summary.consumer';
import { ScheduleService } from './schedule/schedule.service';
import { ConfigService } from '@nestjs/config';
import { summaryQueueConfig } from './queues/summary.queue';
import { MeetingSummaryService } from 'src/modules/summary/summarizer/summarizer.service';
import { OpenAI } from 'src/common/openai/openai-client';

@Module({
  imports: [
    TypeOrmModule.forFeature([Summary]), // Import TypeORM module for Summary entity
    BullModule.registerQueue(summaryQueueConfig),
  ],
  providers: [
    ScheduleService,
    SummaryService,
    SummaryResolver,
    SummaryConsumer,
    SummaryQueueProducer,
    ConfigService,
    MeetingSummaryService,
    {
      provide: OpenAI,
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get('OPENAI_API_KEY');
        return new OpenAI(apiKey);
      },
      inject: [ConfigService],
    },
  ],
  exports: [SummaryService, MeetingSummaryService, OpenAI],
})
export class SummaryModule {}
