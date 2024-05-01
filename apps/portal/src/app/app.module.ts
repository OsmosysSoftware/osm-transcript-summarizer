import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyErrorHandler } from './shared/services/error-handler.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [{ provide: ErrorHandler, useClass: MyErrorHandler }],
  bootstrap: [AppComponent],
})
export class AppModule {}
