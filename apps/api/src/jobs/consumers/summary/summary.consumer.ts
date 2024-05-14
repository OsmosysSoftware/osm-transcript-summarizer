import { Logger } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
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
export class SummaryConsumer {
  private readonly logger = new Logger(SummaryConsumer.name);

  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
    private readonly summaryService: SummaryService,
    private readonly meetingSummarizerService: MeetingSummaryService,
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
      summary.outputText = summaryText;
      // Update job status to SUCCESS
      summary.jobStatus = JobStatus.SUCCESS;
      this.logger.log(`Summary generated successfully for job with ID: ${jobId}`);
    } catch (error) {
      summary.outputText = 'Summary could not be generate. :(';
      summary.jobStatus = JobStatus.FAILED;
      this.logger.error(`Error processing summary job with ID: ${jobId}`);
      this.logger.error(error);
    } finally {
      await this.summaryRepository.save(summary);
    }
  }
}
