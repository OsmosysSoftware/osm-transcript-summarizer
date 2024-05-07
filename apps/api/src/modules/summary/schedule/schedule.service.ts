import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SummaryService } from '../summary.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly summaryService: SummaryService) {}

  @Cron(CronExpression.EVERY_SECOND)
  async addSummaryToQueue(): Promise<void> {
    this.summaryService.addSummaryToQueue();
  }
}