import { Injectable } from '@angular/core';
import { DocumentNode } from 'graphql';
import { QueryRef, Apollo, MutationResult } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { catchError } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(
    private apollo: Apollo,
    private authService: MsalService,
  ) {}

  private getToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  private handleUnauthorizedError(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/error',
    });
  }

  query<T>(query: DocumentNode): Observable<ApolloQueryResult<T>> {
    const token = this.getToken();
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

    return queryRef.valueChanges.pipe(
      catchError((error) => {
        if (this.isUnauthorizedError(error)) {
          this.handleUnauthorizedError();
        }

        return throwError(error);
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate<T>(mutation: DocumentNode, variables: any): Observable<MutationResult<T>> {
    const token = this.getToken();
    return this.apollo
      .mutate<T>({
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
      })
      .pipe(
        catchError((error) => {
          if (this.isUnauthorizedError(error)) {
            this.handleUnauthorizedError();
          }

          return throwError(error);
        }),
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isUnauthorizedError(error: any): boolean {
    return (
      error &&
      error.graphQLErrors &&
      error.graphQLErrors.some(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (err: any) =>
          err.extensions &&
          err.extensions.code === 'UNAUTHENTICATED' &&
          err.message === 'Unauthorized',
      )
    );
  }
}
