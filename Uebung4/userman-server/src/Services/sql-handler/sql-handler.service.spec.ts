import { Test, TestingModule } from '@nestjs/testing';
import { SqlHandlerService } from './sql-handler.service';

describe('SqlHandlerService', () => {
  let service: SqlHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SqlHandlerService],
    }).compile();

    service = module.get<SqlHandlerService>(SqlHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
