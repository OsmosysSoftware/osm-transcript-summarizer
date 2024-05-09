import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryResolver } from './summary.resolver';
import { Summary } from './entities/summary.entity';
import { SummaryResponse } from './dto/create-summary.dto';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { SummaryQueueProducer } from 'src/jobs/producers/summary/summary.producer';
import { SummaryConsumer} from 'src/jobs/consumers/summary/summary.consumer';
import { ScheduleService } from './schedule/schedule.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Summary]), // Import TypeORM module for Summary entity
    BullModule.registerQueue({
      name: 'summary-queue', // Name of the queue
    }),
  ],
  providers: [
    ScheduleService,
    SummaryService,
    SummaryResolver,
    SummaryQueueProducer,
    SummaryConsumer,
  ],
})
export class SummaryModule {}
