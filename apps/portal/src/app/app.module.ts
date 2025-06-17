import { APP_INITIALIZER, NgModule, ErrorHandler } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClient,
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MsalInterceptor,
  MsalModule,
  MsalService,
  MsalInterceptorConfiguration,
  MsalGuardConfiguration,
  MsalGuard,
} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { PrimeNG } from 'primeng/config';
import LaraLightBlue from '@primeng/themes/lara';
import AppRoutingModule from './app-routing.module';
import { PrimeNgModule } from './primeng.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql/graphql.module';
import { MyErrorHandler } from './shared/services/error-handler.service';
import { TranscriptAnalyzerComponent } from './features/transcript-analyzer/transcript-analyzer.component';
import { FileProcessorComponent } from './features/file-processor/file-processor.component';
import { environment } from '../environments/environment';
import HttpLoaderFactory from '../assets/i18n/loader';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.clientId,
      authority: `https://login.microsoftonline.com/${environment.tenantId}`,
      redirectUri: environment.redirectUri,
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: isIE,
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set(environment.graphqlEndpoint, [environment.apiScope]);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap,
  };
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: [environment.apiScope],
    },
  };
}

// Function to initialize PrimeNG theme
function initializePrimeNG(primeng: PrimeNG) {
  return () => {
    // Set your desired PrimeNG theme preset
    primeng.theme.set({
      preset: LaraLightBlue,
      options: {
        darkModeSelector: false || 'none',
      },
    });
  };
}

@NgModule({
  declarations: [AppComponent, TranscriptAnalyzerComponent, FileProcessorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimeNgModule,
    GraphQLModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    MsalModule.forRoot(
      MSALInstanceFactory(),
      MSALGuardConfigFactory(),
      MSALInterceptorConfigFactory(),
    ),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true,
    },
    { provide: ErrorHandler, useClass: MyErrorHandler },
    MessageService,
    MsalService,
    MsalGuard,
    provideHttpClient(withInterceptorsFromDi()),
    PrimeNG,
    {
      provide: APP_INITIALIZER,
      useFactory: initializePrimeNG,
      deps: [PrimeNG],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
