import { Module } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { ProduitsController } from './produits.controller';
import { VendeursModule } from '../vendeurs/vendeurs.module';

@Module({
  imports: [VendeursModule],
  controllers: [ProduitsController],
  providers: [ProduitsService],
  exports: [ProduitsService],
})
export class ProduitsModule {}