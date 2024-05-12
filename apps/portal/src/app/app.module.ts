import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import AppRoutingModule from './app-routing.module';
import { PrimeNgModule } from './primeng.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql/graphql.module';
import { MyErrorHandler } from './shared/services/error-handler.service';
import { TranscriptAnalyzerComponent } from './features/transcript-analyzer/transcript-analyzer.component';
import HttpLoaderFactory from '../assets/i18n/loader';
import { FileProcessorComponent } from './features/file-processor/file-processor.component';

@NgModule({
  declarations: [AppComponent, TranscriptAnalyzerComponent, FileProcessorComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PrimeNgModule,
    GraphQLModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
