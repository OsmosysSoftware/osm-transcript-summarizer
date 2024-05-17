import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SummaryService } from './summary.service';
import { Summary } from './entities/summary.entity';
import { CreateSummaryDTO } from './dto/create-summary.dto';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';
import { SummaryResponse } from './dto/summary-response.dto';
import { UseGuards } from '@nestjs/common';
import { AzureADGuard } from 'src/auth/azure-ad.guard';

@Resolver(() => Summary)
export class SummaryResolver {
  constructor(private readonly summaryService: SummaryService) {}

  @Mutation(() => Summary)
  @UseGuards(AzureADGuard)
  async createSummary(
    @Args('createSummaryInput') createSummaryInput: CreateSummaryDTO,
  ): Promise<Summary> {
    return this.summaryService.createSummary(createSummaryInput);
  }

  @Query(() => SummaryResponse, { name: 'summaries' })
  @UseGuards(AzureADGuard)
  async findAll(
    @Args('options', { type: () => QueryOptionsDto, nullable: true, defaultValue: {} })
    options: QueryOptionsDto,
  ): Promise<SummaryResponse> {
    return this.summaryService.findAllJobs(options);
  }
}
