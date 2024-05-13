import { Injectable } from '@angular/core';
import { DocumentNode } from 'graphql';
import { QueryRef, Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  query<T>(query: DocumentNode): Observable<ApolloQueryResult<T>> {
    const queryRef: QueryRef<T> = this.apollo.use('default').watchQuery({
      query,
    });

    return queryRef.valueChanges;
  }
}
