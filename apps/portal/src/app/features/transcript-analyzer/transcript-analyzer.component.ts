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

  fileType = '';

  limitError = false;

  invalidTypeError = false;

  maxFileSize: number = 10 * 1024 * 1024; // 10 MB

  selectedFileName = '';

  selectedFile: File | null = null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      if (!this.isValidFileType(file)) {
        this.limitError = false;
        this.invalidTypeError = true;
        this.selectedFileName = '';
        this.selectedFile = null;
      } else if (!this.isValidFileSize(file)) {
        this.invalidTypeError = false;
        this.limitError = true;
        this.selectedFileName = '';
        this.selectedFile = null;
      } else {
        this.selectedFileName = file.name;
        this.limitError = false;
        this.invalidTypeError = false;
        this.selectedFile = file;
      }
    }
  }

  isValidFileType(file: File): boolean {
    this.fileType = file.type;
    return this.fileType === 'text/plain' || this.fileType === 'text/vtt';
  }

  isValidFileSize(file: File): boolean {
    return file.size <= this.maxFileSize;
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
          const jobIdsArray = JSON.parse(localStorage.getItem('jobIds') || '[]');
          jobIdsArray.push(jobId);
          localStorage.setItem('jobIds', JSON.stringify(jobIdsArray));
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
