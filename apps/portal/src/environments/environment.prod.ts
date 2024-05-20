import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  graphqlEndpoint: 'http://localhost:3000/graphql',
  tenantId: 'tenant-id',
  clientId: 'client-id',
  redirectUri: 'http://localhost:4200',
  apiScope: 'api://client-id/api.consume',
};
