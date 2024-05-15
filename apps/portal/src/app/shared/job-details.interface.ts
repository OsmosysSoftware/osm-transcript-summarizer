import { JobStatus } from './jobs';

export interface JobDetails {
  fileName: string;
  jobStatus: JobStatus;
  timestamp: string;
  summary?: string | null;
}
