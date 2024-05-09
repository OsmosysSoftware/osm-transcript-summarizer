import { Component, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-transcript-analyzer',
  templateUrl: './transcript-analyzer.component.html',
  styleUrl: './transcript-analyzer.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TranscriptAnalyzerComponent {
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang('en');
  }

  fileType = '';

  limitError = false;

  invalidTypeError = false;

  maxFileSize: number = 10 * 1024 * 1024; // 10 MB

  selectedFileName = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      if (!this.isValidFileType(file)) {
        this.limitError = false;
        this.invalidTypeError = true;
        this.selectedFileName = '';
      } else if (!this.isValidFileSize(file)) {
        this.invalidTypeError = false;
        this.limitError = true;
        this.selectedFileName = '';
      } else {
        this.selectedFileName = file.name;
        this.limitError = false;
        this.invalidTypeError = false;
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
    alert('summarizing');
  }
}
