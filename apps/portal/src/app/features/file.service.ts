import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { GraphqlService } from '../graphql/graphql.service';
import { fetchFileStatus, uploadFileMutation } from '../graphql/graphql.queries';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private jobIdsSubject = new BehaviorSubject<number[]>([]);

  jobIds$ = this.jobIdsSubject.asObservable();

  constructor(
    private graphqlService: GraphqlService,
    private apollo: Apollo,
  ) {
    this.jobIdsSubject.next(JSON.parse(sessionStorage.getItem('jobIds') || '[]'));
  }

  updateJobIds(jobId: number): void {
    const jobIds = [...this.jobIdsSubject.value, jobId];
    sessionStorage.setItem('jobIds', JSON.stringify(jobIds));
    this.jobIdsSubject.next(jobIds);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchSummaries(jobIds: number[]): Observable<any> {
    const jobIdsString = JSON.stringify(jobIds);
    const queryWithJobIdsString = fetchFileStatus(jobIdsString);

    return this.graphqlService.query(queryWithJobIdsString);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uploadFile(file: File): Observable<any> {
    const variables = { inputFile: file };

    return this.graphqlService.mutate(uploadFileMutation, variables);
  }
}
