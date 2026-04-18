import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateStatutDevisDto } from './dto/update-statut-devis.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
@UseGuards(JwtAuthGuard)
@Controller('devis')
export class DevisController {
  constructor(private devisService: DevisService) {}
  @Post() create(@CurrentUser() user: any, @Body() dto: CreateDevisDto) { return this.devisService.create(user.id, dto); }
  @Get() findAll(@CurrentUser() user: any) { return this.devisService.findAll(user.id); }
  @Get(':id') findOne(@Param('id') id: string) { return this.devisService.findOne(id); }
  @Patch(':id/statut') updateStatut(@Param('id') id: string, @Body() dto: UpdateStatutDevisDto) { return this.devisService.updateStatut(id, dto); }
}
