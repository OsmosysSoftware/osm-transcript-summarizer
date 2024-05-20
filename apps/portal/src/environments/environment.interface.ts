export interface Environment {
  apiScope: string;
  redirectUri: string;
  tenantId: string;
  clientId: string;
  production: boolean;
  graphqlEndpoint: string;
}
