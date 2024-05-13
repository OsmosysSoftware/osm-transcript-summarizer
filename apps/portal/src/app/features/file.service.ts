import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { GraphqlService } from '../graphql/graphql.service';
import { fetchFileStatus } from '../graphql/graphql.queries';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(
    private graphqlService: GraphqlService,
    private apollo: Apollo,
  ) {}

  fetchSummaries(jobIds: number[]) {
    const jobIdsString = JSON.stringify(jobIds);
    const queryWithJobIdsString = fetchFileStatus(jobIdsString);

    return this.graphqlService.query(queryWithJobIdsString);
  }
}
