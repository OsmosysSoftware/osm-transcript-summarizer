import { Test, TestingModule } from '@nestjs/testing';
import { SummaryResolver } from './summary.resolver';
import { SummaryService } from './summary.service';

describe('SummaryResolver', () => {
  let resolver: SummaryResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SummaryResolver, SummaryService],
    }).compile();

    resolver = module.get<SummaryResolver>(SummaryResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
