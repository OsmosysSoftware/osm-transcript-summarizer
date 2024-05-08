import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import { JobDetails } from '../../shared/job-details.interface';
import { JobStatus } from '../../shared/jobs';

@Component({
  selector: 'app-file-processor',
  templateUrl: './file-processor.component.html',
  styleUrl: './file-processor.component.scss',
})
export class FileProcessorComponent implements OnInit {
  // to do:the name will probably be changed to match the backend
  jobs: JobDetails[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Dummy data for demonstration
    const dummyJobs: JobDetails[] = [
      {
        id: 1,
        fileName: 'meeting_minutes.txt',
        status: JobStatus.finished,
        timestamp: '2024-05-02 11:37:27',
        summary: `# Meeting Minutes
Layout discussion for Angular login page
Created on: 2024-05-02 11:37:27
Duration: 00:06:10

# Participants
- John Doe
- Amy Smith
- Troy Pines

# Agenda
1. Discuss layout for Angular login page
2. Determine features to include for user experience
3. Decide on design elements and security measures

# Discussion
- Simple form layout suggested by Amy Smith and agreed upon by Troy Pines
- Inclusion of social media login options supported by Amy Smith
- Forgot password link and two-factor authentication considered by John Doe and Amy Smith
- Dark mode option and mobile responsiveness discussed by all
- Error handling features, Google Analytics integration, and CAPTCHA implementation considered for security and user experience
- User customization options, tooltips for form inputs, and password strength validation suggested for user engagement and security

# Action items
1. Implement simple form layout for Angular login page
2. Include social media login options and forgot password link
3. Integrate two-factor authentication and dark mode option
4. Ensure mobile responsiveness and error handling features are in place
5. Implement Google Analytics for tracking and CAPTCHA sparingly
6. Allow user customization within reasonable limits
7. Incorporate tooltips for form inputs and password strength validation
8. Consider multi-language support and terms of service agreement for global user base and legal compliance.`,
      },
      {
        id: 2,
        fileName: 'meeting_minutes.txt',
        status: JobStatus.pending,
        timestamp: '2024-05-02 11:37:27',
        summary: `# Meeting Minutes
Layout discussion for Angular login page
Created on: 2024-05-02 11:37:27
Duration: 00:06:10

# Participants
- John Doe
- Amy Smith
- Troy Pines

# Agenda
1. Discuss layout for Angular login page
2. Determine features to include for user experience
3. Decide on design elements and security measures

# Discussion
- Simple form layout suggested by Amy Smith and agreed upon by Troy Pines
- Inclusion of social media login options supported by Amy Smith
- Forgot password link and two-factor authentication considered by John Doe and Amy Smith
- Dark mode option and mobile responsiveness discussed by all
- Error handling features, Google Analytics integration, and CAPTCHA implementation considered for security and user experience
- User customization options, tooltips for form inputs, and password strength validation suggested for user engagement and security

# Action items
1. Implement simple form layout for Angular login page
2. Include social media login options and forgot password link
3. Integrate two-factor authentication and dark mode option
4. Ensure mobile responsiveness and error handling features are in place
5. Implement Google Analytics for tracking and CAPTCHA sparingly
6. Allow user customization within reasonable limits
7. Incorporate tooltips for form inputs and password strength validation
8. Consider multi-language support and terms of service agreement for global user base and legal compliance.`,
      },
    ];

    // later data will be fetched from api in here
    this.jobs = dummyJobs;
  }

  // eslint-disable-next-line class-methods-use-this
  getSeverity(status: string): string {
    switch (status) {
      case 'FINISHED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'QUEUED':
        return 'primary';
      default:
        return 'info';
    }
  }

  // eslint-disable-next-line class-methods-use-this
  downloadFile(summary: string, fileName: string): void {
    const blob = new Blob([summary], { type: 'text/plain' });
    FileSaver.saveAs(blob, fileName);
  }
}
