import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranscriptAnalyzerComponent } from './transcript-analyzer.component';

describe('TranscriptAnalyzerComponent', () => {
  let component: TranscriptAnalyzerComponent;
  let fixture: ComponentFixture<TranscriptAnalyzerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TranscriptAnalyzerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TranscriptAnalyzerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
