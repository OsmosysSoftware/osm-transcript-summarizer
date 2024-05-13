import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
// eslint-disable-next-line
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';
// eslint-disable-next-line import/extensions
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { environment } from '../../environments/environment';

const uri = environment.graphqlEndpoint;
export function createApollo(): ApolloClientOptions<unknown> {
  return {
    link: createUploadLink({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
