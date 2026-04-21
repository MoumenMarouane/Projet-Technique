import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateStatutDevisDto } from './dto/update-statut-devis.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ClientsService } from '../clients/clients.service';
import { VendeursService } from '../vendeurs/vendeurs.service';

@UseGuards(JwtAuthGuard)
@Controller('devis')
export class DevisController {
  constructor(
    private devisService: DevisService,
    private clientsService: ClientsService,
    private vendeursService: VendeursService,
  ) {}

  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateDevisDto) {
    const client = await this.clientsService.findByUserId(user.id);
    if (!client) throw new Error('Client introuvable');
    return this.devisService.create(client.id, dto);
  }

  @Get()
  async findAll(@CurrentUser() user: any) {
    if (user.role === 'CLIENT') {
      const client = await this.clientsService.findByUserId(user.id);
      if (!client) return [];
      return this.devisService.findAll(client.id, undefined);
    } else {
      const vendeur = await this.vendeursService.findByUserId(user.id);
      if (!vendeur) return [];
      return this.devisService.findAll(undefined, vendeur.id);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(id);
  }

  @Patch(':id/statut')
  updateStatut(@Param('id') id: string, @Body() dto: UpdateStatutDevisDto) {
    return this.devisService.updateStatut(id, dto);
  }
}