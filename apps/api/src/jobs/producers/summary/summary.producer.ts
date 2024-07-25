import { Injectable, Logger, Optional, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Summary } from 'src/modules/summary/entities/summary.entity';
import { SUMMARY_QUEUE } from 'src/modules/summary/queues/summary.queue';

@Injectable()
export class SummaryQueueProducer implements OnModuleDestroy {
  private readonly logger = new Logger(SummaryQueueProducer.name);

  constructor(@Optional() @InjectQueue(SUMMARY_QUEUE) private readonly summaryQueue: Queue) {}

  private listenForError(): void {
    if (this.summaryQueue) {
      this.summaryQueue.client.on('error', (error) => {
        this.logger.error('Redis connection error:');
        this.logger.error(JSON.stringify(error, ['message', 'stack', 2]));
      });
    }
  }

  async onModuleInit(): Promise<void> {
    this.listenForError();
  }

  async addsummaryToQueue(summary: Summary): Promise<void> {
    this.logger.log(`Adding job with ID ${summary.jobId}`);

    if (this.summaryQueue) {
      await this.summaryQueue.add(summary.jobId, {
        removeOnComplete: true,
        removeOnFail: true,
      });
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.summaryQueue) {
      await this.summaryQueue.close();
    }
  }
}
