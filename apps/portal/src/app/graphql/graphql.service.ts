import { Injectable } from '@angular/core';
import { Apollo, MutationResult, QueryRef } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  mutate(mutation: DocumentNode, variables: any): Observable<any> {
    console.log(variables);

    return this.apollo.mutate({
      mutation,
      variables,
      context: {
        hasUpload: true,
        useMultipart: true,
        headers: {
          'content-type': 'application/json',
          'x-apollo-operation-name': 'uploadFile'
        }
      }
    });
  }

  // mutate(mutation: DocumentNode, file: File): Observable<any> {
  //   console.log("mutate:",file);

  //   return this.apollo.mutate({
  //     mutation,
  //     variables: { file },
  //     context: {
  //       hasUpload: true,
  //       useMultipart: true
  //     }
  //   });
  // }

}
