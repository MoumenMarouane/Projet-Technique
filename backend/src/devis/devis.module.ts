import { Module } from '@nestjs/common';
import { DevisController } from './devis.controller';
import { DevisService } from './devis.service';

@Module({
  controllers: [DevisController],
  providers: [DevisService]
})
export class DevisModule {}
