import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesController } from './commandes.controller';
import { VendeursModule } from '../vendeurs/vendeurs.module';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [VendeursModule, ClientsModule],
  controllers: [CommandesController],
  providers: [CommandesService],
  exports: [CommandesService],
})
export class CommandesModule {}