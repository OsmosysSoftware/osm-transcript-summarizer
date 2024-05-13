import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink} from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { environment } from '../../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uri = environment.graphqlEndpoint;
export function createApollo(httpLink: HttpLink): ApolloClientOptions<unknown> {
  return {
    // link: httpLink.create({ uri }),
    link: createUploadLink({ uri }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule,HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
