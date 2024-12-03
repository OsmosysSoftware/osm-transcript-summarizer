import { Controller, Post } from '@nestjs/common';
import { ScheduleService } from './schedule/schedule.service';

@Controller('summary')
export class SummaryController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('schedule')
  async addPendingSummariesToQueue(): Promise<void> {
    this.scheduleService.addSummaryToQueue();
  }
}
