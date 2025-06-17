import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { MsalService } from '@azure/msal-angular';
import { FileService } from '../file.service';
import { ResponseData } from '../../../common/interface';

@Component({
    selector: 'app-transcript-analyzer',
    templateUrl: './transcript-analyzer.component.html',
    styleUrl: './transcript-analyzer.component.scss',
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class TranscriptAnalyzerComponent {
  constructor(
    private translate: TranslateService,
    private fileService: FileService,
    private messageService: MessageService,
    private authService: MsalService,
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

  onClear(): void {
    this.selectedFile = null;
  }

  onRemove(): void {
    this.selectedFile = null;
  }

  summarizeTranscript(): void {
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
      (result: ResponseData) => {
        // Check if the result contains errors
        if (result.errors && result.errors.length > 0) {
          const unauthorizedError = result.errors.find(
            (error) =>
              error.extensions.code === 'UNAUTHENTICATED' && error.message === 'Unauthorized',
          );

          if (unauthorizedError) {
            this.translate
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

          this.translate.get('TRANSCRIPT.ERRORS.FILE_UPLOAD').subscribe((translation: string) => {
            this.messageService.add({
              key: 'tst',
              severity: 'error',
              summary: '',
              detail: `${translation}`,
            });
          });
          return;
        }

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

  private handleUnauthorizedError(): void {
    // Redirect to error page or logout
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  }
}
