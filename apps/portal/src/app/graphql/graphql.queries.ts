import { gql } from "apollo-angular";

export const uploadFileMutation = gql`
  mutation ($file: Upload!) {
    createSummary(createSummaryInput: { inputFile: $file }) {
      jobId
    }
  }
`;
