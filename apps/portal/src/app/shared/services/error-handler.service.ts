import { ErrorHandler, Injectable } from '@angular/core';
import { Logger } from './logger.service';

@Injectable()
export class MyErrorHandler implements ErrorHandler {
  constructor(private logger: Logger) {}

  // eslint-disable-next-line
  handleError(error: any): void {
    // code to use logger will be done here
  }
}
