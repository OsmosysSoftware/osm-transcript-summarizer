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
  ],
  exports: [SummaryService],
})
export class SummaryModule {}
