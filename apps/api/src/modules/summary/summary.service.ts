import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Summary } from './entities/summary.entity';
import { Repository } from 'typeorm';
import { SummaryResponse } from './dto/create-summary.dto';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';
import { JobStatus, Status } from 'src/common/constants/summary';
import { CoreService } from 'src/common/graphql/services/core.service';



@Injectable()
export class SummaryService extends CoreService<Summary> {
    protected readonly logger = new Logger(SummaryService.name);
    private isProcessingQueue: boolean = false;

    constructor(
        @InjectRepository(Summary)
        private readonly summaryRepository: Repository<Summary>,
    ) {
        super(summaryRepository);
    }

    async getAllJobsSummary(
        options: QueryOptionsDto,
        authorizationHeader: Request,
    ): Promise<SummaryResponse> {
        this.logger.log('Getting all summaries with options.');

        // Get the applicationId currently being used for filtering data based on api key
        // const filterApplicationId = await this.getApplicationIdFromApiKey(authorizationHeader);

        const baseConditions = [
            { field: 'status', value: Status.ACTIVE },
            { field: 'applicationId', value: 10 },
        ];
        const searchableFields = ['createdBy', 'data', 'result'];

        const { items, total } = await super.findAll(
            options,
            'notification',
            searchableFields,
            baseConditions,
        );
        return new SummaryResponse(items, total, options.offset, options.limit);
    }
}
