import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { GraphqlService } from '../../graphql/graphql.service';

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

    const query = gql`
    query FetchSummaries{
      summaries(options: {limit:10, offset:0, sortOrder:ASC, filters:[{field:"jobId", operator:"in", value:"${jobIdsString}"}]}) {
        limit
        offset
        summaries {
          createdBy
          createdOn
          jobId
          inputFile
          jobStatus
          modifiedBy
          modifiedOn
          outputText
          status
        }
        total
      }
    }
  `;

    return this.apollo.query({
      query,
    });
  }
}
