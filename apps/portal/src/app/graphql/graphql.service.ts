import { Injectable } from '@angular/core';
import { DocumentNode } from 'graphql';
import { QueryRef, Apollo, MutationResult } from 'apollo-angular';
import { Observable, of } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(private apollo: Apollo) {}

  private getToken(): Observable<string> {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
      return of(token);
    }

    throw new Error('No access token found');
  }

  query<T>(query: DocumentNode): Observable<ApolloQueryResult<T>> {
    return this.getToken().pipe(
      switchMap((token) => {
        const queryRef: QueryRef<T> = this.apollo.use('default').watchQuery({
          query,
          errorPolicy: 'all',
          fetchPolicy: 'network-only',
          context: {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        });

        return queryRef.valueChanges;
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate<T>(mutation: DocumentNode, variables: any): Observable<MutationResult<T>> {
    return this.getToken().pipe(
      switchMap((token) =>
        this.apollo.mutate<T>({
          mutation,
          variables: { file: variables.inputFile },
          context: {
            hasUpload: true,
            useMultipart: true,
            headers: {
              'content-type': 'application/json',
              'x-apollo-operation-name': 'createSummary',
              Authorization: `Bearer ${token}`,
            },
          },
          errorPolicy: 'all',
          fetchPolicy: 'network-only',
        }),
      ),
    );
  }
}
