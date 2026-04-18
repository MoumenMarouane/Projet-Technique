import { Module } from '@nestjs/common';
import { VendeursController } from './vendeurs.controller';
import { VendeursService } from './vendeurs.service';

@Module({
  controllers: [VendeursController],
  providers: [VendeursService]
})
export class VendeursModule {}
