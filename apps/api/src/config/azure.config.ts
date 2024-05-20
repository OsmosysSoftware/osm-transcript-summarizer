import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

export const AzureConfig = {
  credentials: {
    tenantID: configService.getOrThrow<string>('AAD_TENANT_ID'),
    clientID: configService.getOrThrow<string>('AAD_CLIENT_ID'),
    audience: configService.getOrThrow<string>('AAD_AUDIENCE'),
    scopes: configService.getOrThrow<string>('AAD_SCOPES').split(','),
  },
  metadata: {
    authority: configService.getOrThrow<string>('AAD_AUTHORITY'),
    discovery: configService.getOrThrow<string>('AAD_DISCOVERY'),
    version: configService.getOrThrow<string>('AAD_METADATA_VERSION'),
  },
  settings: {
    validateIssuer: configService.getOrThrow<string>('AAD_VALIDATE_ISSUER'),
    passReqToCallback: false,
    loggingLevel: configService.getOrThrow<string>('AAD_LOGGING_LEVEL'),
  },
};
