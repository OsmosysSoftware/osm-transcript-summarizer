import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SummaryService } from './summary.service';
import { Summary } from './entities/summary.entity';
import { CreateSummaryDTO } from './dto/create-summary.dto';
import Upload = require('graphql-upload/Upload.js');
import GraphQLUpload = require('graphql-upload/GraphQLUpload.js');
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';

@Resolver(() => Summary)
export class SummaryResolver {
  constructor(private readonly summaryService: SummaryService) { }

  @Mutation(() => Summary)
  async createSummary(
    @Args('createSummaryInput') createSummaryInput: CreateSummaryDTO,
  ): Promise<Summary> {
    return this.summaryService.createSummary(createSummaryInput);
  }

  @Query(() => [Summary], { name: 'summary' })
  findAll() {
    return;
  }
}
