import { Injectable, Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { SUMMARY_QUEUE } from 'src/modules/summary/queues/summary.queue';
import { SummaryService } from 'src/modules/summary/summary.service';
import { Repository } from 'typeorm';
import { Summary } from 'src/modules/summary/entities/summary.entity'; 

@Injectable()
export class SummaryConsumer {
  private readonly logger = new Logger(SummaryConsumer.name);

  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
    private readonly summaryService: SummaryService, 
  ) {}

  async processSummaryQueue(job: Job<number>): Promise<void> {
    const jobId = job.data;
    const summary = await this.summaryService.getSummaryById(jobId);
    if (!summary) {
      this.logger.error(`Summary with ID ${jobId} not found.`);
      return;
    }

    try {
      // Generate random text for testing
      const randomSummaryText = this.generateRandomSummary();
      await this.summaryRepository.save(summary);
      this.logger.log(`Processing summary job with ID: ${jobId}`);
    } catch (error) {
      this.logger.error(`Error processing summary job with ID: ${jobId}`);
      this.logger.error(error);
    }
    
  }
  private generateRandomSummary(): string {
    // Placeholder for generating random summary text
    return "This is a random summary text for testing purposes.";
  }
}

@Processor(SUMMARY_QUEUE)
export class SummaryQueueProcessor {
  constructor(private readonly summaryConsumer: SummaryConsumer) {}

  @Process()
  async processSummary(job: Job<number>): Promise<void> {
    await this.summaryConsumer.processSummaryQueue(job);
  }
}
