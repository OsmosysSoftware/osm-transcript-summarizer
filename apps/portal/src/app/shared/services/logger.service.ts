import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, catchError } from 'rxjs';
import { LogLevel, LogSeverity } from '../enum';

@Injectable({
  providedIn: 'root',
})
export class Logger {
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  log(
    severity: LogSeverity,
    level: LogLevel,
    sessionId: string | null,
    screenName: string | null,
    source: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any | null,
    message: string,
    stackTrace: string | null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Observable<any> {
    try {
      const timestamp = new Date().toISOString();
      const deviceInfo = this.getDeviceInfo();
      const logObject = {
        timestamp,
        level,
        severity,
        sessionId,
        screenName,
        source,
        deviceInfo,
        data,
        message,
        stackTrace,
      };

      // Dummy code for sending API request
      return this.http.post(this.apiUrl, logObject).pipe(
        catchError((error) =>
          // eslint-disable-line
          throwError(() => new Error(error)),
        ),
      );
    } catch (error) {
      return throwError(() => new Error('Error occured while logging'));
    }
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  private getDeviceInfo(): any {
    const { userAgent } = window.navigator;
    let platform = '';

    if (userAgent.match(/Win/)) {
      platform = 'Windows';
    } else if (userAgent.match(/Mac/)) {
      platform = 'Mac';
    } else if (userAgent.match(/Linux/)) {
      platform = 'Linux';
    } else if (userAgent.match(/Android/)) {
      platform = 'Android';
    } else if (userAgent.match(/iPhone|iPad|iPod/)) {
      platform = 'iOS';
    } else {
      platform = 'Other';
    }

    return {
      userAgent,
      language: window.navigator.language,
      platform,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      onlineStatus: navigator.onLine,
    };
  }
}
