import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { ClientsModule } from '../clients/clients.module';
import { VendeursModule } from '../vendeurs/vendeurs.module';

@Module({
  imports: [ClientsModule, VendeursModule],
  controllers: [DevisController],
  providers: [DevisService],
})
export class DevisModule {}