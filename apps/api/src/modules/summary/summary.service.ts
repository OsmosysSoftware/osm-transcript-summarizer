import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from './entities/summary.entity';
import { Repository } from 'typeorm';
import { SummaryResponse } from './dto/create-summary.dto';
import { JobStatus, Status } from 'src/common/constants/summary';
import { SummaryQueueProducer } from 'src/jobs/producers/summary/summary.producer'



@Injectable()
export class SummaryService {
    protected readonly logger = new Logger(SummaryService.name);
    private isProcessingQueue: boolean = false;

    constructor(
        @InjectRepository(Summary)
        private readonly summaryRepository: Repository<Summary>,
        private readonly summaryQueueService: SummaryQueueProducer,

      ) {
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
        this.logger.log('Starting CRON job to add pending notifications to queue');
    
        if (this.isProcessingQueue) {
          this.logger.log('Notifications are already being added to queue, skipping this CRON job');
          return;
        }
    
        this.isProcessingQueue = true;
        let allPendingSummaries = [];
    
        try {
          allPendingSummaries = await this.getPendingSummary();
        } catch (error) {
          this.isProcessingQueue = false;
          this.logger.error('Error fetching pending summaries');
          this.logger.error(JSON.stringify(error, null, 2));
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
            this.logger.error(JSON.stringify(error, null, 2));
          } finally {
            await this.summaryRepository.save(summary);
          }
        }
    
        this.isProcessingQueue = false;
      }
    

    async getAllJobsSummary(
        // options: QueryOptionsDto,
        authorizationHeader: Request,
    ): Promise<SummaryResponse> {
        this.logger.log('Getting all notifications with options.');

    

        // const baseConditions = [
        //     { field: 'status', value: Status.ACTIVE },
        //     { field: 'applicationId', value: filterApplicationId },
        // ];
        // const searchableFields = ['createdBy', 'data', 'result'];

        // const { items, total } = await super.findAll(
        //     options,
        //     'notification',
        //     searchableFields,
        //     baseConditions,
        // );
        let items = [];
        return new SummaryResponse(items);
    }
}
