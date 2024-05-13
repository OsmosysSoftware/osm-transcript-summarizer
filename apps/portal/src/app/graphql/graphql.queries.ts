import { gql } from 'apollo-angular';

export const fetchFileStatus = (jobIdsString: string) => gql`
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
