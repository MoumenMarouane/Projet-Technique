import { Test, TestingModule } from '@nestjs/testing';
import { VendeursController } from './vendeurs.controller';

describe('VendeursController', () => {
  let controller: VendeursController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VendeursController],
    }).compile();

    controller = module.get<VendeursController>(VendeursController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
