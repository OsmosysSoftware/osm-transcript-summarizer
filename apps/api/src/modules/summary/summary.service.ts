import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Summary } from './entities/summary.entity';
import { CreateSummaryDTO } from './dto/create-summary.dto';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SummaryService {
  protected readonly logger = new Logger(SummaryService.name);

  constructor(
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
  ) {
  }

  async createSummary(createSummaryInput: CreateSummaryDTO): Promise<Summary> {
    const { inputFile } = createSummaryInput;
    if (inputFile) {
      const { createReadStream, filename } = await inputFile;

      const uniqueIdentifier = uuidv4();
      const modifiedFilename = `${filename}_${uniqueIdentifier}`;
      const fileLocation = join(process.cwd(), `./src/upload/${modifiedFilename}`);

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

}

