import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MsalGuard } from '@azure/msal-angular';
import { TranscriptAnalyzerComponent } from './features/transcript-analyzer/transcript-analyzer.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'transcript',
          component: TranscriptAnalyzerComponent,
          canActivate: [MsalGuard],
        },
        {
          path: '**',
          redirectTo: 'transcript',
          pathMatch: 'full',
        },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      },
    ),
  ],
  exports: [RouterModule],
})
export default class AppRoutingModule {}
