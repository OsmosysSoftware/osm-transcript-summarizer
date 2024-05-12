import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { JobDetails } from '../../shared/job-details.interface';
import { JobStatus } from '../../shared/jobs';
import { FileService } from '../../shared/services/file.service';
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

  constructor(
    private fileService: FileService,
    private messageService: MessageService,
    private translateService: TranslateService,
  ) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit(): void {
    const jobIds = [1, 2, 3, 4, 5, 6]; // Once file upload api is integrated will change this code
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
      },
      (error) => {
        if (error) {
          this.translateService.get('ERRORS.UNHANDLED_ERROR').subscribe((translation: string) => {
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
  }

  // eslint-disable-next-line class-methods-use-this
  getSeverity(status: number): string {
    switch (status) {
      case 1:
        return 'warning';
      case 2:
        return 'primary';
      case 3:
        return 'info';
      case 4:
        return 'success';
      default:
        return 'error';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getStatusText(status: number): string {
    switch (status) {
      case 1:
        return JobStatus.pending;
      case 2:
        return JobStatus.queued;
      case 3:
        return JobStatus.inProgress;
      case 4:
        return JobStatus.queued;
      default:
        return JobStatus.failed;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  downloadFile(summary: string | null | undefined, fileName: string): void {
    if (summary !== undefined && summary !== null) {
      const blob = new Blob([summary], { type: 'text/markdown' });
      FileSaver.saveAs(blob, fileName);
    }
  }
}
