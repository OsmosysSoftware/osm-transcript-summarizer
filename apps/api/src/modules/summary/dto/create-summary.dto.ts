import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Summary } from '../entities/summary.entity';

@ObjectType()
export class SummaryResponse {
  @Field(() => [Summary])
  summaries: Summary[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  offset: number;

  @Field(() => Int)
  limit: number;

  constructor(items: Summary[]) {
    this.summaries = items;
    // this.total = total;
    // this.offset = offset ?? 0;
    // this.limit = limit ?? items.length;
  }
}
