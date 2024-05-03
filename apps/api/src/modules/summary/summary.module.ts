import { Module } from '@nestjs/common';
import { SummaryService } from './summary.service';
import { SummaryResolver } from './summary.resolver';

@Module({
  providers: [SummaryService, SummaryResolver]
})
export class SummaryModule {}
