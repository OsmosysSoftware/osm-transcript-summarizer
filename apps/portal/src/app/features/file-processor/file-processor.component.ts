import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { JobDetails } from '../../shared/job-details.interface';
import { JobStatus } from '../../shared/jobs';
import { FileService } from '../file.service';
import { Summary } from '../../shared/summary.interface';

@Component({
  selector: 'app-file-processor',
  templateUrl: './file-processor.component.html',
  styleUrl: './file-processor.component.scss',
})
export class FileProcessorComponent implements OnInit {
  // to do:the name will probably be changed to match the backend
  jobDetail: JobDetails[] = [];

  summaries: Summary[] = [];

  jobIds: number[] = [];

  constructor(
    private fileService: FileService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.fileService.jobIds$.subscribe((jobIds) => {
      this.fileService.fetchSummaries(jobIds).subscribe(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (result: any) => {
          this.summaries = result.data.summaries.summaries;
          this.jobDetail = this.summaries.map((summary) => ({
            fileName: summary.inputFile.split('_')[1],
            status: summary.status,
            timestamp: new Date(summary.createdOn).toLocaleString(),
            summary: summary.outputText,
          }));
          this.jobDetail.reverse();
        },
        (error) => {
          if (error.status === 0) {
            this.translateService.get('ERRORS.UNHANDLED_ERROR').subscribe((translation: string) => {
              this.messageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Network Error',
                detail: translation,
              });
            });
          } else {
            this.translateService.get('ERRORS.API_ERROR').subscribe((translation: string) => {
              this.messageService.add({
                key: 'tst',
                severity: 'error',
                summary: 'Error',
                detail: translation,
              });
            });
          }
        },
      );
    });
  }

  // eslint-disable-next-line class-methods-use-this
  getSeverity(status: number): string {
    const severityMap: { [key: number]: string } = {
      1: 'warning',
      2: 'primary',
      3: 'info',
      4: 'success',
    };
    return severityMap[status] || 'error';
  }

  // eslint-disable-next-line class-methods-use-this
  getStatusText(status: number): string {
    const statusTextMap: { [key: number]: JobStatus } = {
      1: JobStatus.pending,
      2: JobStatus.queued,
      3: JobStatus.inProgress,
      4: JobStatus.finished,
      5: JobStatus.failed,
    };

    return statusTextMap[status];
  }

  // eslint-disable-next-line class-methods-use-this
  downloadFile(summary: string | null | undefined, fileName: string): void {
    if (summary !== undefined && summary !== null) {
      const blob = new Blob([summary], { type: 'text/markdown' });
      FileSaver.saveAs(blob, fileName);
    }
  }
}
