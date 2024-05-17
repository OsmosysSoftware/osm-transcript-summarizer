import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
} from '@azure/msal-angular';
import {
  InteractionStatus,
  RedirectRequest,
  AuthenticationResult,
  EventMessage,
  EventType,
} from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'msal-angular-tutorial';

  isIframe = false;

  loginDisplay = false;

  private readonly destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private broadcastService: MsalBroadcastService,
    private authService: MsalService,
  ) {}

  ngOnInit(): void {
    this.isIframe = window !== window.parent && !window.opener;

    this.broadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$),
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    this.broadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this.destroying$),
      )
      .subscribe((result: EventMessage) => {
        const payload = result.payload as AuthenticationResult;
        sessionStorage.setItem('accessToken', payload.accessToken);
        this.setLoginDisplay();
      });

    this.tryAcquireToken();
  }

  login(): void {
    const request: RedirectRequest = {
      ...this.msalGuardConfig.authRequest,
      scopes: [environment.apiScope],
    };

    this.authService.loginRedirect(request);
  }

  logout(): void {
    this.authService.logoutRedirect({
      postLogoutRedirectUri: '/',
    });
  }

  setLoginDisplay(): void {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  tryAcquireToken(): void {
    const scopes = [environment.apiScope]; // Specify the scopes your app requires
    const account = this.authService.instance.getAllAccounts()[0];

    if (account) {
      this.authService.acquireTokenSilent({ scopes, account }).subscribe({
        next: (tokenResponse: AuthenticationResult) => {
          sessionStorage.setItem('accessToken', tokenResponse.accessToken);
        },
        error: () => {
          // Fallback to interactive method if silent fails
          this.authService.acquireTokenRedirect({ scopes });
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroying$.next(undefined);
    this.destroying$.complete();
  }
}
