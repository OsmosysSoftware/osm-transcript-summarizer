import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Summary } from 'src/modules/summary/entities/summary.entity';
// import { ChannelType } from 'src/common/constants/summary';

@Injectable()
export class SummaryQueueProducer {
  private readonly logger = new Logger(SummaryQueueProducer.name);

  constructor(
    @Optional() @InjectQueue() private readonly summaryQueue: Queue,
  ) {}

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
    if (this.summaryQueue) {
      await this.summaryQueue.add(summary.jobId);
    }
  }
}
