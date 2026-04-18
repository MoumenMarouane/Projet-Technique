import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { FacturesService } from './factures.service';
import { CreatePaiementDto } from './dto/create-paiement.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('factures')
export class FacturesController {
  constructor(private facturesService: FacturesService) {}
  @Get(':id') findOne(@Param('id') id: string) { return this.facturesService.findOne(id); }
  @Post(':id/paiements') addPaiement(@Param('id') id: string, @Body() dto: CreatePaiementDto) { return this.facturesService.addPaiement(id, dto); }
}
