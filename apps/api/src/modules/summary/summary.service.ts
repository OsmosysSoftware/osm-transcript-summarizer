import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from './entities/summary.entity';
import { Repository } from 'typeorm';
import { SummaryResponse } from './dto/create-summary.dto';
import { JobStatus, Status } from 'src/common/constants/summary';



@Injectable()
export class SummaryService {
    protected readonly logger = new Logger(SummaryService.name);
    private isProcessingQueue: boolean = false;

    constructor(
        @InjectRepository(Summary)
        private readonly summaryRepository: Repository<Summary>,

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
