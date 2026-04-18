import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { CreateProduitDto } from './dto/create-produit.dto';
import { CaracValeurDto } from './dto/carac-valeur.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@Controller('produits')
export class ProduitsController {
  constructor(private produitsService: ProduitsService) {}
  @Get() findAll() { return this.produitsService.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.produitsService.findOne(id); }
  @UseGuards(JwtAuthGuard) @Post() create(@CurrentUser() user: any, @Body() dto: CreateProduitDto) { return this.produitsService.create(user.id, dto); }
  @UseGuards(JwtAuthGuard) @Patch(':id') update(@Param('id') id: string, @Body() dto: Partial<CreateProduitDto>) { return this.produitsService.update(id, dto); }
  @UseGuards(JwtAuthGuard) @Delete(':id') remove(@Param('id') id: string) { return this.produitsService.remove(id); }
  @UseGuards(JwtAuthGuard) @Post(':id/carac-valeurs') addCaracValeur(@Param('id') id: string, @Body() dto: CaracValeurDto) { return this.produitsService.addCaracValeur(id, dto); }
}
