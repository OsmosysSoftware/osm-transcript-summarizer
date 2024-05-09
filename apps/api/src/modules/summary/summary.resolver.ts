import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SummaryService } from './summary.service';
import { Summary } from './entities/summary.entity';
import { CreateSummaryDTO } from './dto/create-summary.dto';

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
    return null;
  }
}
