import { gql } from "apollo-angular";

export const uploadFileMutation = gql`
  mutation ($file: Upload!) {
    createSummary(createSummaryInput: { inputFile: $file }) {
      jobId
    }
  }
`;
// export const FETCH_ALL_RECORDS_QUERY = gql`
//   query FetchAllRecords {
//     summaries(options: { limit: 10, offset: 0, sortOrder: ASC, filters: [{ field: "job_id", operator: "in", value: "[5,6]" }] }) {
//       limit
//       offset
//       summaries {
//         createdBy
//         createdOn
//         job_id
//         inputFile
//         jobStatus
//         modifiedBy
//         modifiedOn
//         outputText
//         status
//       }
//       total
//     }
//   }
// `;
