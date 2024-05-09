import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary } from './entities/summary.entity';
import { CreateSummaryDTO } from './dto/create-summary.dto';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';
import { CoreService } from 'src/common/graphql/services/core.service';
import { Status } from 'src/common/constants/summary';
import { SummaryResponse } from './dto/summary-response.dto';

@Injectable()
export class SummaryService extends CoreService<Summary> {
  protected readonly logger = new Logger(SummaryService.name);

  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
  ) {
    super(summaryRepository);
  }

  async createSummary(createSummaryInput: CreateSummaryDTO): Promise<Summary> {
    const { inputFile, jobStatus } = createSummaryInput;

    if (inputFile) {
      const filename = inputFile.filename;
      const fileContent = await this.streamToString(inputFile.createReadStream());
      const summary = this.summaryRepository.create({ jobStatus, inputFile: fileContent });
      return await this.summaryRepository.save(summary);
    } else {
      const summary = this.summaryRepository.create({ jobStatus });
      return await this.summaryRepository.save(summary);
    }
  }

  private async streamToString(stream: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk: any) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
      stream.on('error', (error: any) => reject(error));
    });
  }


  async findAllJobs(
    options: QueryOptionsDto): Promise<SummaryResponse> {
    this.logger.log('Getting all jobs with options.');

    const baseConditions = [
      { field: 'status', value: Status.ACTIVE },
    ];
    const searchableFields = ['createdBy', 'data', 'result'];

    const { items, total } = await super.findAll(
      options,
      'summary',
      searchableFields,
      baseConditions,
    );
    return new SummaryResponse(items, total, options.offset, options.limit);
  }

}
