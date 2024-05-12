import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary } from './entities/summary.entity';
import { CreateSummaryDTO } from './dto/create-summary.dto';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';
import { CoreService } from 'src/common/graphql/services/core.service';
import { Status } from 'src/common/constants/summary';
import { SummaryResponse } from './dto/summary-response.dto';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs-extra';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();
const configService = new ConfigService();

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
    const { inputFile } = createSummaryInput;
    if (inputFile) {
      const { createReadStream, filename } = await inputFile;

      const uniqueIdentifier = uuidv4().replace(/-/g, '').substring(0, 12);
      const modifiedFilename = `${uniqueIdentifier}_${filename}`;
      const fileLocation = join(process.cwd(), configService.getOrThrow('Upload_Path'), modifiedFilename);

      await fs.ensureDir(join(process.cwd(), configService.getOrThrow('Upload_Path')));

      return new Promise((resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(fileLocation))
          .on('finish', async () => {
            const summary = this.summaryRepository.create({ inputFile: modifiedFilename });
            try {
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

