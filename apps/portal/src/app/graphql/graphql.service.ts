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

  mutate(mutation: any, file: File): Observable<any> {
    console.log("mutate:",file);

    return this.apollo.mutate({
      mutation,
      variables: { file }
    });
  }

}
