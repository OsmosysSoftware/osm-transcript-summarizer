import { Component, OnInit, OnDestroy } from '@angular/core';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { JobDetails } from '../../shared/job-details.interface';
import { JobStatus } from '../../shared/jobs';
import { FileService } from '../file.service';
import { Summary } from '../../shared/summary.interface';
import { ResponseData } from '../../../common/interface';

const POLLING_DELAY_IN_MILLISECONDS = 5000;
@Component({
  selector: 'app-file-processor',
  templateUrl: './file-processor.component.html',
  styleUrls: ['./file-processor.component.scss'],
})
export class FileProcessorComponent implements OnInit, OnDestroy {
  jobDetails: JobDetails[] = [];

  summaries: Summary[] = [];

  jobIds: number[] = [];

  fetchInterval: Subscription | null = null;

  constructor(
    private fileService: FileService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authService: MsalService,
  ) {
    this.translateService.setDefaultLang('en');
  }

  ngOnInit(): void {
    this.fileService.jobIds$.subscribe((jobIds) => {
      this.jobIds = jobIds;

      if (this.jobIds.length !== 0) {
        this.startFetchingSummaries();
      } else {
        this.stopFetchingSummaries();
      }
    });
  }

  ngOnDestroy(): void {
    this.stopFetchingSummaries();
  }

  startFetchingSummaries(): void {
    this.fetchSummaries();
    this.fetchInterval = interval(POLLING_DELAY_IN_MILLISECONDS).subscribe(() => {
      this.fetchSummaries();
    });
  }

  stopFetchingSummaries(): void {
    if (this.fetchInterval) {
      this.fetchInterval.unsubscribe();
      this.fetchInterval = null;
    }
  }

  fetchSummaries(): void {
    this.fileService.fetchSummaries(this.jobIds).subscribe(
      (result: ResponseData) => {
        // Check if the result contains errors
        if (result.errors && result.errors.length > 0) {
          const unauthorizedError = result.errors.find(
            (error) =>
              error.extensions.code === 'UNAUTHENTICATED' && error.message === 'Unauthorized',
          );

          if (unauthorizedError) {
            this.translateService
              .get('TRANSCRIPT.ERRORS.UNAUTHORIZED')
              .subscribe((translation: string) => {
                this.messageService.add({
                  key: 'tst',
                  severity: 'error',
                  summary: '',
                  detail: `${translation}`,
                });
              });
            this.handleUnauthorizedError();
            return;
          }

          this.translateService
            .get('TRANSCRIPT.ERRORS.FILE_UPLOAD')
            .subscribe((translation: string) => {
              this.messageService.add({
                key: 'tst',
                severity: 'error',
                summary: '',
                detail: `${translation}`,
              });
            });
          return;
        }

        this.summaries = result.data.summaries.summaries;
        this.jobDetails = this.summaries.map((summary) => ({
          fileName: summary.inputFile.split('_')[1] || summary.inputFile,
          jobStatus: summary.jobStatus,
          timestamp: new Date(summary.createdOn).toLocaleString(),
          summary: summary.outputText || null,
        })) as unknown as JobDetails[];

        this.jobDetails.reverse();

        // Check if all jobs are either failed or finished
        const allJobsCompleted = this.jobDetails.every(
          (job) => job.jobStatus === JobStatus.finished || job.jobStatus === JobStatus.failed,
        );

        if (allJobsCompleted) {
          this.stopFetchingSummaries();
        }
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
  }

  getSeverity(status: number): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
    const severityMap: { [key: number]: 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' } = {
      1: 'warning',
      2: 'secondary',
      3: 'info',
      4: 'success',
      5: 'danger',
    };
    return severityMap[status] || undefined;
  }

  getStatusText(status: number): string {
    const statusTextMap: { [key: number]: string } = {
      1: 'PENDING',
      2: 'QUEUED',
      3: 'IN PROGRESS',
      4: 'FINISHED',
      5: 'FAILED',
    };

    return statusTextMap[status];
  }

  downloadFile(summary: string | null | undefined, fileName: string): void {
    if (summary !== undefined && summary !== null) {
      const blob = new Blob([summary], { type: 'text/markdown' });
      FileSaver.saveAs(blob, `${fileName.replace(/\.(txt|vtt)$/i, '')}.md`);
    }
  }

  private handleUnauthorizedError(): void {
    // Redirect to error page or logout
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  }
}
