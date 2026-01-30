import { Test, TestingModule } from '@nestjs/testing';
import { GuidanceAgendasService } from './guidance-agendas.service';

describe('GuidanceAgendasService', () => {
  let service: GuidanceAgendasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuidanceAgendasService],
    }).compile();

    service = module.get<GuidanceAgendasService>(GuidanceAgendasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
