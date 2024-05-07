import { Args, Context, Query, Resolver } from '@nestjs/graphql';
import { SummaryService } from './summary.service';
import { Summary } from './entities/summary.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UseGuards } from '@nestjs/common';
import { SummaryResponse } from './dto/create-summary.dto';
import { QueryOptionsDto } from 'src/common/graphql/dtos/query-options.dto';

@Resolver(() => Summary)
export class SummaryResolver {
    constructor(private readonly SummaryService: SummaryService) { }

    @Query(() => SummaryResponse, { name: 'summary' })
    async findAll(
        @Context() context
        // @Args('options', { type: () => QueryOptionsDto, nullable: true, defaultValue: {} })
        // options: QueryOptionsDto,
    ): Promise<SummaryResponse> {
        const request: Request = context.req;
        const authorizationHeader = request.headers['authorization'];
        return this.SummaryService.getAllJobsSummary(authorizationHeader);
    }

    @Query(() => String)
    sayHello(): string {
        return 'Hello World!';
    }


}
