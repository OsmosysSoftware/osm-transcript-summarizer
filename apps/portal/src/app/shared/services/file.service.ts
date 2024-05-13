import { Injectable } from '@angular/core';
import { uploadFileMutation } from '../../graphql/graphql.queries';
import { GraphqlService } from '../../graphql/graphql.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private graphqlService: GraphqlService) { }

  uploadFile(file: File): Observable<any> {
    console.log("file service",file);
    const variables = { inputFile: file };
    console.log(variables);
    console.log(variables.inputFile);


    return this.graphqlService.mutate(uploadFileMutation, variables);
  }

  // uploadFile(file: File): any {
  //   const uploadFileMutation = gql`
  //     mutation uploadFile($file: Upload!) {
  //       createSummary(createSummaryInput: { inputFile: $file }) {
  //         id
  //       }
  //     }
  //   `;

  //   return this.apollo.mutate({
  //     mutation: uploadFileMutation,
  //     variables: { file },
  //     context: {
  //       useMultipart: true
  //     }
  //   });
  // }
}
