import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SummaryService } from '../summary.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class ScheduleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ScheduleService.name);
  private isProcessing: boolean = false;
  private redisClient: Redis;

  constructor(
    private readonly summaryService: SummaryService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    this.redisClient = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  async addSummaryToQueueCron(): Promise<void> {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    try {
      this.logMemoryUsage();
      await this.summaryService.addSummaryToQueue();
    } catch (error) {
      this.logger.error('Error in addSummaryToQueue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private logMemoryUsage(): void {
    // Node.js memory usage
    const memoryUsage = process.memoryUsage();
    this.logger.log(
      `Memory Usage: RSS = ${memoryUsage.rss / 1024 / 1024} MB, Heap Total = ${memoryUsage.heapTotal / 1024 / 1024} MB, Heap Used = ${memoryUsage.heapUsed / 1024 / 1024} MB`,
    );

    // Redis memory usage
    this.redisClient.info('memory', (err, res) => {
      if (err) {
        this.logger.error('Error fetching Redis memory info:', err);
      } else {
        const memoryInfo = this.parseRedisMemoryInfo(res);
        this.logger.log(
          `Redis Memory Usage: Used = ${memoryInfo.used_memory_human}, RSS = ${memoryInfo.used_memory_rss_human}, Peak = ${memoryInfo.used_memory_peak_human}, System Memory = ${memoryInfo.total_system_memory_human}, Fragmentation Ratio = ${memoryInfo.mem_fragmentation_ratio}`,
        );
      }
    });
  }

  // eslint-disable-next-line
  private parseRedisMemoryInfo(info: string): any {
    const memoryInfo = {};
    const lines = info.split('\r\n');
    const relevantKeys = [
      'used_memory_human',
      'used_memory_rss_human',
      'used_memory_peak_human',
      'total_system_memory_human',
      'mem_fragmentation_ratio',
    ];
    lines.forEach((line) => {
      const [key, value] = line.split(':');

      if (relevantKeys.includes(key)) {
        memoryInfo[key] = value;
      }
    });
    return memoryInfo;
  }

  async onModuleDestroy(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}
