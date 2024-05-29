import { Injectable } from '@angular/core';
import { DocumentNode } from 'graphql';
import { QueryRef, Apollo, MutationResult } from 'apollo-angular';
import { Observable, throwError } from 'rxjs';
import { ApolloQueryResult } from '@apollo/client';
import { catchError, switchMap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GraphqlService {
  constructor(
    private apollo: Apollo,
    private authService: MsalService,
  ) {}

  private getToken(): Observable<string> {
    const account =
      this.authService.instance.getActiveAccount() || this.authService.instance.getAllAccounts()[0];

    if (!account) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return throwError('No active account found');
    }

    const request = {
      scopes: [environment.apiScope],
      account,
    };
    const token = this.authService.acquireTokenSilent(request).pipe(
      switchMap((response: AuthenticationResult) => {
        if (response && response.accessToken) {
          return [response.accessToken];
        }

        return throwError('Failed to acquire token');
      }),
      catchError((error) => {
        console.error('Error acquiring token silently', error);
        return throwError(error);
      }),
    );
    return token;
  }

  private handleUnauthorizedError(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/error',
    });
  }

  query<T>(query: DocumentNode): Observable<ApolloQueryResult<T>> {
    return this.getToken().pipe(
      switchMap((token: string) => {
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
    return this.getToken().pipe(
      switchMap((token: string) =>
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
