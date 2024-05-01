import { TestBed } from '@angular/core/testing';

import { MyErrorHandler } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: MyErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
