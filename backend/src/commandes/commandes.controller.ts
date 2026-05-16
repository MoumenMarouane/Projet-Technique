import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CreateCommandeDto } from './dto/create-commande.dto';
import { UpdateStatutCommandeDto } from './dto/update-statut-commande.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VendeursService } from '../vendeurs/vendeurs.service';
import { ClientsService } from '../clients/clients.service';

@UseGuards(JwtAuthGuard)
@Controller('commandes')
export class CommandesController {
  constructor(
    private commandesService: CommandesService,
    private vendeursService: VendeursService,
    private clientsService: ClientsService,
  ) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateCommandeDto) {
    return this.commandesService.create(user.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    if (user.role === 'VENDEUR') {
      const vendeur = await this.vendeursService.findByUserId(user.id);
      if (!vendeur) return [];
      return this.commandesService.findAll(undefined, vendeur.id);
    } else {
      const client = await this.clientsService.findByUserId(user.id);
      if (!client) return [];
      return this.commandesService.findAll(client.id, undefined);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandesService.findOne(id);
  }

  @Patch(':id/statut')
  updateStatut(@Param('id') id: string, @Body() dto: UpdateStatutCommandeDto) {
    return this.commandesService.updateStatut(id, dto);
  }
}