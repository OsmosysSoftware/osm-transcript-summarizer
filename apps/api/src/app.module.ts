import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './modules/summary/schedule/schedule.service';
import { SummaryModule } from './modules/summary/summary.module';
import { DatabaseModule } from './database/database.module';



@Module({
  imports: [
    DatabaseModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    ScheduleModule.forRoot(),
    SummaryModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
