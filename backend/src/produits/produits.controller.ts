import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { CaracValeurDto } from './dto/carac-valeur.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { VendeursService } from '../vendeurs/vendeurs.service';

@Controller('produits')
export class ProduitsController {
  constructor(
    private produitsService: ProduitsService,
    private vendeursService: VendeursService,
  ) {}

  @Get() findAll() { return this.produitsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.produitsService.findOne(id); }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@CurrentUser() user: any, @Body() dto: CreateProduitDto) {
    const vendeur = await this.vendeursService.findByUserId(user.id);
    if (!vendeur) throw new Error('Vendeur introuvable');
    return this.produitsService.create(vendeur.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateProduitDto>) { return this.produitsService.update(id, dto); }
  @UseGuards(JwtAuthGuard)
  @Delete(':id') remove(@Param('id') id: string) { return this.produitsService.remove(id); }
  @UseGuards(JwtAuthGuard)
  @Post(':id/carac-valeurs') addCaracValeur(@Param('id') id: string, @Body() dto: CaracValeurDto) { return this.produitsService.addCaracValeur(id, dto); }
}