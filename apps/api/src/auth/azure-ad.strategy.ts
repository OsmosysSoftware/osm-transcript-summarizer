import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BearerStrategy } from 'passport-azure-ad';
import { AzureConfig } from 'src/config/azure.config';

@Injectable()
export class AzureADStrategy extends PassportStrategy(BearerStrategy, 'azure-ad') {
  constructor() {
    super({
      identityMetadata: `https://${AzureConfig.metadata.authority}/${AzureConfig.credentials.tenantID}/${AzureConfig.metadata.version}/${AzureConfig.metadata.discovery}`,
      issuer: `https://sts.windows.net/${AzureConfig.credentials.tenantID}/`,
      clientID: AzureConfig.credentials.clientID,
      audience: AzureConfig.credentials.audience,
      validateIssuer: AzureConfig.settings.validateIssuer,
      passReqToCallback: AzureConfig.settings.passReqToCallback,
      loggingLevel: AzureConfig.settings.loggingLevel,
      scope: AzureConfig.credentials.scopes,
      loggingNoPII: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async validate(profile: any): Promise<any> {
    // Implement user validation and extraction of necessary user information from profile
    // Example: Extract and store user details in a session
    return profile;
  }
}
