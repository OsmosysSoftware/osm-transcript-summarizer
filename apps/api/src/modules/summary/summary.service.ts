import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary } from './entities/summary.entity';
import { CreateSummaryDTO } from './dto/create-summary.dto';
import { createWriteStream } from 'fs';
import { join, resolve } from 'path';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';
import { CoreService } from 'src/common/graphql/services/core.service';
import { JobStatus, Status } from 'src/common/constants/summary';
import { SummaryResponse } from './dto/summary-response.dto';
import { v4 as uuidv4 } from 'uuid';
import { SummaryQueueProducer } from 'src/jobs/producers/summary/summary.producer';
import * as fs from 'fs-extra';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

@Injectable()
export class SummaryService extends CoreService<Summary> {
  protected readonly logger = new Logger(SummaryService.name);
  private isProcessingQueue: boolean = false;

  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
    private readonly summaryQueueService: SummaryQueueProducer,
  ) {
    super(summaryRepository);
  }

  async createSummary(createSummaryInput: CreateSummaryDTO): Promise<Summary> {
    const { inputFile } = createSummaryInput;

    if (inputFile) {
      const { createReadStream, filename } = await inputFile;

      const uniqueIdentifier = uuidv4().replace(/-/g, '').substring(0, 10);
      const modifiedFilename = `${uniqueIdentifier}_${filename}`;
      const uploadPath = configService.get('UPLOAD_FOLDER_PATH')?.replace(/[^\w\s/]/g, '') ?? null;

      const uploadFolder = join(process.cwd(), 'uploads');

      if (uploadPath) {
        const absoluteUploadPath = resolve(uploadPath);
        await fs.ensureDir(absoluteUploadPath);
      } else {
        await fs.ensureDir(uploadFolder);
      }

      const fileLocation = join(uploadPath || uploadFolder, modifiedFilename);

      return new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(fileLocation))
          .on('finish', async () => {
            const summary = this.summaryRepository.create({ inputFile: modifiedFilename });

            try {
              this.logger.log(
                `Saving Uploaded File Details for ${modifiedFilename} at ${fileLocation}`,
              );
              const savedSummary = await this.summaryRepository.save(summary);
              resolve(savedSummary);
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            reject(error);
          });
      });
    }
  }

  async findAllJobs(options: QueryOptionsDto): Promise<SummaryResponse> {
    this.logger.log('Getting all jobs with options.');

    const baseConditions = [{ field: 'status', value: Status.ACTIVE }];
    const searchableFields = ['createdBy', 'data', 'result'];

    const { items, total } = await super.findAll(
      options,
      'summary',
      searchableFields,
      baseConditions,
    );
    return new SummaryResponse(items, total, options.offset, options.limit);
  }

  getSummaryById(jobId: number): Promise<Summary[]> {
    this.logger.log(`Getting summary with id: ${jobId}`);
    return this.summaryRepository.find({
      where: {
        jobId: jobId,
        status: Status.ACTIVE,
      },
    });
  }
  getPendingSummary(): Promise<Summary[]> {
    this.logger.log('Getting all active pending summaries');
    return this.summaryRepository.find({
      where: {
        jobStatus: JobStatus.PENDING,
        status: Status.ACTIVE,
      },
    });
  }

  async addSummaryToQueue(): Promise<void> {
    this.logger.log('Starting CRON job to add pending summaries to queue');

    if (this.isProcessingQueue) {
      this.logger.log('Summaries are already being added to queue, skipping this CRON job');
      return;
    }

    this.isProcessingQueue = true;
    let allPendingSummaries = [];

    try {
      allPendingSummaries = await this.getPendingSummary();
    } catch (error) {
      this.isProcessingQueue = false;
      this.logger.error('Error fetching pending summaries');
      this.logger.error(JSON.stringify(error, ['message', 'stack', 2]));
      return;
    }

    this.logger.log(`Adding ${allPendingSummaries.length} pending summaries to queue`);

    for (const summary of allPendingSummaries) {
      try {
        summary.jobStatus = JobStatus.IN_PROGRESS;
        await this.summaryQueueService.addsummaryToQueue(summary);
      } catch (error) {
        summary.jobStatus = JobStatus.PENDING;
        summary.result = { result: error };
        this.logger.error(`Error adding summary with id: ${summary.id} to queue`);
        this.logger.error(JSON.stringify(error, ['message', 'stack', 2]));
      } finally {
        await this.summaryRepository.save(summary);
      }
    }

    this.isProcessingQueue = false;
  }
}
