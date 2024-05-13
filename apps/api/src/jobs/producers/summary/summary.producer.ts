import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Summary } from 'src/modules/summary/entities/summary.entity';
import { SUMMARY_QUEUE } from 'src/modules/summary/queues/summary.queue';

@Injectable()
export class SummaryQueueProducer {
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
    this.logger.log(summary.jobId);

    if (this.summaryQueue) {
      await this.summaryQueue.add(summary.jobId);
    }
  }
}
