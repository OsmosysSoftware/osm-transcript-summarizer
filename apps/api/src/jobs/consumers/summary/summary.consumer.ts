import { Logger, OnModuleDestroy } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary } from 'src/modules/summary/entities/summary.entity';
import { JobStatus } from 'src/common/constants/summary';
import { MeetingSummaryService } from 'src/modules/summary/summarizer/summarizer.service';
import { SummaryService } from 'src/modules/summary/summary.service';
import * as path from 'path';
import * as fs from 'fs/promises';
import { SUMMARY_QUEUE } from 'src/modules/summary/queues/summary.queue';
import { uploadDir } from 'src/main';

@Processor(SUMMARY_QUEUE)
export class SummaryConsumer implements OnModuleDestroy {
  private readonly logger = new Logger(SummaryConsumer.name);

  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
    private readonly summaryService: SummaryService,
    private readonly meetingSummarizerService: MeetingSummaryService,
    @InjectQueue(SUMMARY_QUEUE) private readonly summaryQueue: Queue,
  ) {}

  @Process()
  async processSummary(job: Job<number>): Promise<void> {
    await this.processSummaryQueue(job);
  }

  async processSummaryQueue(job: Job<number>): Promise<void> {
    const jobId = job.data;
    const summaries = await this.summaryService.getSummaryById(jobId);
    const summary = summaries[0];

    if (!summary) {
      this.logger.error(`Summary with ID ${jobId} not found.`);
      return;
    }

    try {
      const originalPath = summary.inputFile;
      const filename = path.basename(originalPath);

      const newPath = path.join(uploadDir, filename);
      const fileContent = await fs.readFile(newPath, 'utf-8');

      this.logger.log(`Generating summary for job with ID: ${jobId}`);
      const summaryText = await this.meetingSummarizerService.generateMeetingSummary(fileContent);
      summary.outputText =
        summaryText ||
        "Summary could not be generated, please check if it's a valid teams transcript file";
      summary.jobStatus = JobStatus.SUCCESS;
      this.logger.log(`Summary generated successfully for job with ID: ${jobId}`);
    } catch (error) {
      summary.outputText = 'Summary could not be generated due to an error.';
      summary.jobStatus = JobStatus.FAILED;
      this.logger.error(`Error processing summary job with ID: ${jobId}`);
      this.logger.error(JSON.stringify(error, ['message', 'stack', 2]));
    } finally {
      await this.summaryRepository.save(summary);
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.summaryQueue) {
      await this.summaryQueue.close();
    }
  }
}
