import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApolloQueryResult } from '@apollo/client';
import { MessageService } from 'primeng/api';
import { FileService } from '../file.service';

@Component({
  selector: 'app-transcript-analyzer',
  templateUrl: './transcript-analyzer.component.html',
  styleUrl: './transcript-analyzer.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TranscriptAnalyzerComponent {
  constructor(
    private translate: TranslateService,
    private fileService: FileService,
    private messageService: MessageService,
  ) {
    this.translate.setDefaultLang('en');
  }

  maxFileSize: number = 10 * 1024 * 1024; // 10 MB

  selectedFile: File | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileSelected(event: any): void {
    const { files } = event.originalEvent.target;
    const file: File = files[0];

    if (file) {
      this.selectedFile = file;
    }
  }

  // eslint-disable-next-line
  summarizeTranscript(): void {
    // eslint-disable-next-line
    if (!this.selectedFile) {
      this.translate.get('TRANSCRIPT.ERRORS.NO_FILE').subscribe((translation: string) => {
        this.messageService.add({
          key: 'tst',
          severity: 'error',
          summary: '',
          detail: translation,
        });
      });
      return;
    }

    this.fileService.uploadFile(this.selectedFile).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result: ApolloQueryResult<any>) => {
        const jobId = result?.data?.createSummary?.jobId;

        if (jobId) {
          const jobIdsArray = JSON.parse(sessionStorage.getItem('jobIds') || '[]');
          jobIdsArray.push(jobId);
          sessionStorage.setItem('jobIds', JSON.stringify(jobIdsArray));
          this.fileService.updateJobIds(jobId);
        }
      },
      (error) => {
        if (error.status === 0) {
          this.translate.get('ERRORS.UNHANDLED_ERROR').subscribe((translation: string) => {
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: 'Network Error',
              detail: translation,
            });
          });
        } else {
          this.translate.get('TRANSCRIPT.ERRORS.FILE_UPLOAD').subscribe((translation: string) => {
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: '',
              detail: translation,
            });
          });
        }
      },
    );
  }
}
